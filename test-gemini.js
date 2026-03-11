const fs = require("fs");

async function test() {
  const imgBuffer = fs.readFileSync("/Applications/Safari.app/Contents/Resources/AppIcon.icns");
  const base64 = imgBuffer.toString("base64");
  
  const currentState = {
    websiteProps: { name: "Test Site" },
    tokens: { colors: { primary: "#000000" } },
    pages: [],
    activePageId: "none"
  };

  const formData = new FormData();
  formData.append("prompt", "change primary color to red based on this image");
  formData.append("currentState", JSON.stringify(currentState));
  formData.append("images", new Blob([imgBuffer], { type: "image/png" }), "logo.png");

  try {
    const res = await fetch("http://localhost:3000/api/edit", {
      method: "POST",
      body: formData
    });
    console.log("Status:", res.status);
    console.log("Response:", await res.text());
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
