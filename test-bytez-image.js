const fs = require("fs");
const Bytez = require("bytez.js");
const sdk = new Bytez("d0a484c7394303209afaa881f7a3f8bd");

async function test() {
  const model = sdk.model("google/gemini-1.5-pro");
  const imgBuffer = fs.readFileSync("/Applications/Safari.app/Contents/Resources/AppIcon.icns");
  const base64 = imgBuffer.toString("base64");
  
  const messages = [
    { role: "user", content: [
      { type: "text", text: "what is this?" },
      { type: "image_url", image_url: { url: `data:image/png;base64,${base64}` } }
    ]}
  ];

  try {
    const res = await model.run(messages);
    console.log("Success:", JSON.stringify(res));
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
