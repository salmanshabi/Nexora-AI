import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  try {
    const body = await req.json();
    const { description, language } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 },
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 },
      );
    }

    const languageInstruction =
      language && language !== "auto"
        ? `\nCRITICAL OUTWARD LANGUAGE RULE: You MUST respond and output all string values (except keys and IDs) entirely in the '${language}' language. Translate any generated text to '${language}'.`
        : `\nCRITICAL OUTWARD LANGUAGE RULE: You MUST infer the language from the user's description and respond entirely in that language.`;

    const systemPrompt = `You are a smart AI assistant for a website builder called Nexora.
Your task is to analyze the user's description of their desired website and extract the following information into a strict JSON format. Do not include any explanations, only the JSON block.
${languageInstruction}

The JSON should have these exact keys:
- businessName: String. The name of the business or project. Return "" if none is mentioned.
- businessDescription: String. A concise summary of what the business does.
- audienceGender: String. E.g. "Men", "Women", "Teens", "Children", "Elderly", "Everyone".
- audienceAge: String. E.g. "Under 18", "18-24", "25-34", "35-44", "45-54", "55+", "All Ages".
- style: String. E.g. "Minimal", "Bold", "Elegant", "Playful", "Corporate", "Futuristic".
- colors: String. E.g. "Ocean", "Sunset", "Forest", "Midnight", "Berry", "Minimal", "Warm", "Neon", "Earth", "Pastel", "Monochrome", "Candy".
- pages: String. A comma-separated list of needed pages. E.g. "Home, About, Contact, Gallery". Always include Home.

If any value is ambiguous or not mentioned, make a smart, educated guess based on the description's industry or context.`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: description }],
    });

    const textContent = message.content.find((c) => c.type === "text");
    const output = textContent?.text ?? "";

    let parsedResult: Record<string, unknown> = { error: "Could not parse" };
    try {
      const jsonMatch = output.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[1].trim());
      } else {
        parsedResult = JSON.parse(output.trim());
      }
    } catch {
      parsedResult = { rawOutput: output };
    }

    if (userId) {
      const supabase = createSupabaseAdminClient();
      supabase.from("ai_usage_logs").insert({
        owner_id: userId,
        provider: "anthropic",
        kind: "analyze",
        tokens_used: (message.usage?.input_tokens ?? 0) + (message.usage?.output_tokens ?? 0),
        metadata: { model: "claude-opus-4-6", prompt_length: description?.length ?? 0 },
      }).then(({ error: logErr }) => {
        if (logErr) console.error("Failed to log AI usage:", logErr);
      });
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Analyze API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
