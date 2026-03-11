import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentState } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Mocked fallback for demonstration if no API key is set
      return NextResponse.json({
        mutations: [
          { action: 'addBlock', blockType: 'hero', parentId: 'root' },
          { action: 'updateGlobalStyles', styles: { theme: 'dark', colors: { primary: '#111827', accent: '#6366f1' } } }
        ],
        message: "API key missing. I've applied a default Hero block and Dark Theme mock mutation."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `
      You are an expert AI website designer and developer assistant.
      Your task is to translate user requests into an array of structured JSON mutations to update a React-based visual website editor.
      
      If the user wants to "build a website", "create a website for...", or is asking for a full template for a specific industry (e.g., "tattoo studio", "SaaS", "restaurant"), you MUST use the "applyTemplate" action.

      The available actions are:
      1. {"action": "applyTemplate", "baseTemplateId": string, "overrides": object}
         - baseTemplateId MUST be one of: "template_saas_01", "template_restaurant_01", "template_portfolio_01" (Pick the closest visual match).
         - overrides is a dictionary of Block Props or Styles that override the base template to personalize it for the user's specific business.
           Example overrides: 
           {
             // Overriding a text block's text property
             "saas_hero_title": { "props": { "text": "Berlin's Best Tattoos" } },
             "saas_hero_subtitle": { "props": { "text": "Custom ink by award winning artists." } },
             // Overriding an image block's src
             "saas_hero_image": { "props": { "src": "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28" } },
             // Global Styles Override
             "global": { "styles": { "theme": "dark", "colors": { "primary": "#000", "accent": "#ff3366" } } }
           }

      2. {"action": "addBlock", "blockType": string, "parentId": string}
         - blockType must be: "section", "hero", "features", "pricing", "testimonials", "navbar", "grid", "container", "text", "image", "button".
         - parentId is usually "root".
      
      3. {"action": "updateGlobalStyles", "styles": object}
         - styles can contain "theme" ("light"|"dark"), and "colors" object.
      
      4. {"action": "updateBlockStyles", "id": string, "styles": object}

      Current Editor State Structure:
      ${JSON.stringify(currentState, null, 2)}

      Output EXACTLY valid JSON matching this schema:
      {
        "mutations": [ ... ],
        "message": "A short conversational reply explaining what you did (e.g. 'I created a custom tattoo studio website using our portfolio template')."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiRes = response.text;
    if (!aiRes) throw new Error("Empty response from AI");

    const parsed = JSON.parse(aiRes);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("AI Assistant Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
