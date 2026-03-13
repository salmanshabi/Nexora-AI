import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
    const session = await auth();
    const userId = session?.user?.id ?? null;

    try {
        const formData = await req.formData();
        const prompt = formData.get("prompt") as string;
        const currentStateStr = formData.get("currentState") as string;
        const language = formData.get("language") as string;

        const images: File[] = [];
        for (const [key, value] of Array.from(formData.entries())) {
            if (key === "images" && value instanceof File && value.type.startsWith("image/")) {
                images.push(value);
            }
        }

        if (!prompt && images.length === 0) {
            return NextResponse.json({ error: "Prompt or image is required" }, { status: 400 });
        }

        let currentState = {};
        if (currentStateStr) {
            try {
                currentState = JSON.parse(currentStateStr);
            } catch (e) {
                console.error("Failed to parse currentState", e);
            }
        }

        const languageInstruction = language && language !== 'auto'
            ? `\nCRITICAL OUTWARD LANGUAGE RULE: You MUST output all textual content, explanations, and placeholder strings in the '${language}' language. Do not output English unless the user's prompt is explicitly asking for English.`
            : `\nCRITICAL OUTWARD LANGUAGE RULE: You MUST infer the language from the user's prompt and output ALL textual content in that inferred language.`;

        const systemInstruction = `
You are an expert AI website designer and editor.
The user's website is built on a modern block-based architecture where each page contains an array of "sections", and each section contains a nested tree of "elements".
You will be provided with the CURRENT STATE of their website, including the \`pages\` (which holds the sections and elements), the \`activePage\` they are on, and global design properties like colors.
If images are provided, examine them to understand the user's desired style, layout, branding, or color palette.
${languageInstruction}

Evaluate the user's command. Return ONLY a valid JSON object containing the properties that should be updated. Return no other text or explanation.
- To add, edit, or delete UI elements, return a "pages" array with the updated page object(s). A page object has "id", "title", "slug", "isHiddenInNav", "seo", and "sections".
- VERY IMPORTANT: Sections use an "elements" tree architecture.
  Each section requires: "id", "type" ("Hero", "Features", "CallToAction", "Text"), "isLocked", and "layout".
  - "layout" signature: { "width": "contained"|"full", "padding": "compact"|"default"|"spacious", "backgroundType": "transparent"|"solid"|"gradient", "columns": { "desktop": 1|2|3|4 } }
  - "elements": an array of ElementNode objects.

  ElementNode signature:
  - "id": unique string
  - "type": "Text" | "Button" | "Image" | "Container" | "FeatureCard"
  - "props": { "content"?: string, "size"?: "sm"|"md"|"lg", "variant"?: "primary"|"secondary"|"outline", "url"?: string, "customColor"?: "hex", "textAlign"?: { "desktop": "left"|"center"|"right" } }
  - "children"?: Array of nested ElementNodes (used primarily by 'Container' and 'FeatureCard' types)

- To change global styles, return a "tokens" object matching the DesignTokens interface (colors: {primary, secondary, background, text}, typography: {headingFont, bodyFont, baseSizeMultiplier}, spacing, roundness: "sharp"|"slight"|"pill", shadows: "none"|"soft"|"harsh").
- To change the site name or logo, return a "websiteProps" object { name, logoUrl }.

Current State:
${JSON.stringify(currentState || {}, null, 2)}
`;

        let output: string;
        let provider: string;
        let totalTokens = 0;

        if (images.length > 0) {
            // Use Gemini for multimodal (image) editing
            if (!process.env.GEMINI_API_KEY) {
                return NextResponse.json({ error: "Image editing not configured" }, { status: 500 });
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

            const contents: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [
                { text: systemInstruction },
                { text: prompt || "Analyze this image and apply its style/content to my site." }
            ];

            for (const file of images) {
                const buffer = await file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString("base64");
                contents.push({ inlineData: { data: base64, mimeType: file.type } });
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents,
                config: { temperature: 0.1 },
            });
            output = response.text ?? "";
            provider = "gemini";
        } else {
            // Use Anthropic for text-only editing
            if (!process.env.ANTHROPIC_API_KEY) {
                return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
            }

            const message = await client.messages.create({
                model: "claude-opus-4-6",
                max_tokens: 4096,
                system: systemInstruction,
                messages: [{ role: "user", content: prompt }],
            });

            const textContent = message.content.find((c) => c.type === "text");
            output = textContent?.text ?? "";
            provider = "anthropic";
            totalTokens = (message.usage?.input_tokens ?? 0) + (message.usage?.output_tokens ?? 0);
        }

        // Parse JSON output
        const extractJSON = (str: string) => {
            let cleanStr = str;
            if (cleanStr.includes("```json")) cleanStr = cleanStr.split("```json")[1].split("```")[0];
            else if (cleanStr.includes("```")) cleanStr = cleanStr.split("```")[1].split("```")[0];
            return JSON.parse(cleanStr.trim());
        };

        let parsedResult: Record<string, unknown> = {};
        try {
            parsedResult = extractJSON(output);
        } catch (e) {
            console.error("Failed to parse AI edit JSON:", output, e);
            return NextResponse.json({ error: "Invalid JSON format returned" }, { status: 500 });
        }

        if (userId) {
            const supabase = createSupabaseAdminClient();
            supabase.from("ai_usage_logs").insert({
                owner_id: userId,
                provider,
                kind: "edit",
                tokens_used: totalTokens || Math.ceil((prompt?.length ?? 0) / 4),
                metadata: {
                    model: images.length > 0 ? "gemini-2.5-flash" : "claude-opus-4-6",
                    prompt_length: prompt?.length ?? 0,
                    has_images: images.length > 0,
                },
            }).then(({ error: logErr }) => {
                if (logErr) console.error("Failed to log AI usage:", logErr);
            });
        }

        return NextResponse.json(parsedResult);
    } catch (err) {
        console.error("Edit API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
