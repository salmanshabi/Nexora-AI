import { NextResponse } from "next/server";
import Bytez from "bytez.js";

const key = "d0a484c7394303209afaa881f7a3f8bd";
const sdk = new Bytez(key);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // choose a stable, fast image model
        const model = sdk.model("stabilityai/stable-diffusion-xl-base-1.0");

        // send input to model
        const { error, output } = await model.run(prompt);

        if (error) {
            console.error("Bytez AI Image Error:", error);
            return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
        }

        // output is an array of byte arrays, we need to convert to base64
        // bytez usually returns `[{ data: "base64String..." }]` or a single base64 string
        // Let's inspect the output type carefully. 
        // Usually it returns an array of base64 strings if you ask for multiple, or a direct base64 string.
        let imageData = "";
        if (typeof output === "string") {
            imageData = output;
        } else if (Array.isArray(output) && output.length > 0) {
            if (typeof output[0] === 'string') {
                imageData = output[0];
            } else if (output[0].base64) {
                imageData = output[0].base64;
            } else {
                // Unhandled output type
                console.error("Unknown image output type", output);
                return NextResponse.json({ error: "Unknown image format returned" }, { status: 500 });
            }
        } else {
            console.error("Unknown image output form", output);
            return NextResponse.json({ error: "Failed to parse image format" }, { status: 500 });
        }

        // ensure it's formatted as a data URI for the image src
        if (!imageData.startsWith("data:image")) {
            imageData = `data:image/jpeg;base64,${imageData}`;
        }

        return NextResponse.json({ image: imageData });
    } catch (error) {
        console.error("Image Generation API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
