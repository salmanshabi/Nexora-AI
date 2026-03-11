import { NextResponse } from "next/server";
import Bytez from "bytez.js";

const key = "d0a484c7394303209afaa881f7a3f8bd";
const sdk = new Bytez(key);

// choose claude-opus-4-6
const model = sdk.model("anthropic/claude-opus-4-6");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, language } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 },
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

    // send input to model
    const { error, output } = await model.run([
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: description,
      },
    ]);

    if (error) {
      console.error("Bytez AI Error:", error);
      return NextResponse.json(
        { error: "Failed to process the request" },
        { status: 500 },
      );
    }

    // Try to parse the output if it's stringified JSON inside markdown ticks
    let parsedResult: any = { error: "Could not parse" };
    if (typeof output === "string") {
      try {
        const jsonMatch = output.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[1].trim());
        } else {
          parsedResult = JSON.parse(output.trim());
        }
      } catch (parseError) {
        console.error("Failed to parse AI output as JSON:", parseError);
        parsedResult = { rawOutput: output }; // Fallback
      }
    } else if (
      Array.isArray(output) &&
      output.length > 0 &&
      output[0].content
    ) {
      // Sometimes claude's output is an array of messages or an object
      const textOutput = output[0].content;
      try {
        const jsonMatch = textOutput.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[1].trim());
        } else {
          parsedResult = JSON.parse(textOutput.trim());
        }
      } catch (e) {
        console.error("Failed to parse array item as JSON", e);
        parsedResult = { rawOutput: textOutput };
      }
    } else if (output && output.content) {
      // Sometimes bytez response might be { role: 'assistant', content: '```json...```' }
      const textOutput = output.content;
      try {
        const jsonMatch = textOutput.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[1].trim());
        } else {
          parsedResult = JSON.parse(textOutput.trim());
        }
      } catch (e) {
        console.error("Failed to parse output content as JSON", e);
        parsedResult = { rawOutput: textOutput };
      }
    } else {
      // Direct object response fallback
      parsedResult = output;
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
