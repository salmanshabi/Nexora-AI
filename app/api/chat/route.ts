import { NextResponse } from "next/server";
import Bytez from "bytez.js";

const key = "d0a484c7394303209afaa881f7a3f8bd";
const sdk = new Bytez(key);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
        }

        const systemInstruction = `
You are the built-in AI Assistant for the "Nexora AI" website builder. 
Your goal is to help the user build beautiful websites and troubleshoot any issues they might have within the builder.
Always respond with clarity, encouragement, and actionable advice.

IMPORTANT: When applicable, use markdown formatting for emphasis, code blocks, or step-by-step instructions.

<frontend_aesthetics>
If the user asks for design advice, you tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: propose creative, distinctive frontends that surprise and delight.

Focus on:
- Typography: Recommend fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
- Color & Theme: Suggest committing to a cohesive aesthetic. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Suggest CSS gradients, geometric patterns, or contextual effects.

Avoid generic AI-generated aesthetics:
- Overused font families
- Clichéd color schemes
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character
</frontend_aesthetics>
        `;

        const modelName = "anthropic/claude-opus-4-5-20251101";
        const model = sdk.model(modelName);

        // Prep messages for Bytez/Anthropic
        const apiMessages = [
            { role: "system", content: systemInstruction },
            ...messages.map((m: any) => ({
                role: m.role,
                content: m.content
            }))
        ];

        const result = await model.run(apiMessages);

        if (result.error) {
            console.error(\`Bytez AI Chat Error (\${modelName}):\`, result.error);
            return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 });
        }

        // Handle various output formats from Bytez
        let responseContent = "I'm sorry, I couldn't generate a response.";
        const output = result.output;
        
        if (typeof output === "string") {
            responseContent = output;
        } else if (typeof output === "object" && output !== null) {
            if (!Array.isArray(output) && 'content' in output) {
                responseContent = output.content;
            } else if (Array.isArray(output) && output.length > 0) {
                const firstResult = output[0];
                if (firstResult?.message?.content) {
                    responseContent = firstResult.message.content;
                } else if (typeof firstResult?.content === 'string') {
                    responseContent = firstResult.content;
                }
            }
        }

        return NextResponse.json({ role: 'assistant', content: responseContent });
    } catch (err) {
        console.error("Chat API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
