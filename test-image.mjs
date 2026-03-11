import Bytez from "bytez.js";

const key = "d0a484c7394303209afaa881f7a3f8bd";
const sdk = new Bytez(key);

const model = sdk.model("google/gemini-3.1-flash-image-preview");

(async () => {
    try {
        const { error, output } = await model.run("A cat in a wizard hat");
        console.log("Error:", error);
        console.log("Output type:", typeof output);
        if (output) {
            if (Array.isArray(output)) console.log("Array length:", output.length, "First item keys:", Object.keys(output[0]));
            else if (typeof output === 'string') console.log("String length:", output.length);
            else console.log("Object keys:", Object.keys(output));
        }
    } catch (err) {
        console.error("Catch Exception:", err);
    }
})();
