import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

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

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Messages array is required' }), { status: 400 });
        }

        const apiKey = process.env.AI_GATEWAY_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'AI Gateway key not configured' }), { status: 500 });
        }

        const gateway = createOpenAI({
            baseURL: process.env.AI_GATEWAY_URL ?? 'https://ai-gateway.vercel.sh/v1',
            apiKey,
        });

        const result = streamText({
            model: gateway('anthropic/claude-opus-4-5-20251101'),
            system: systemInstruction,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (err) {
        console.error('Chat API Error:', err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
