import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
    const session = await auth();
    const userId = session?.user?.id ?? null;

    try {
        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Image generation not configured" }, { status: 500 });
        }

        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: prompt,
            config: {
                responseModalities: ["IMAGE", "TEXT"],
            },
        });

        let imageData = "";
        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData?.data) {
                imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }

        if (!imageData) {
            console.error("No image returned from Gemini", response);
            return NextResponse.json({ error: "No image generated" }, { status: 500 });
        }

        if (userId) {
            const supabase = createSupabaseAdminClient();
            supabase.from("ai_usage_logs").insert({
                owner_id: userId,
                provider: "gemini",
                kind: "image",
                tokens_used: Math.ceil(prompt.length / 4),
                metadata: { model: "gemini-2.0-flash-preview-image-generation", prompt_length: prompt.length },
            }).then(({ error: logErr }) => {
                if (logErr) console.error("Failed to log AI usage:", logErr);
            });
        }

        return NextResponse.json({ image: imageData });
    } catch (error) {
        console.error("Image Generation API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
