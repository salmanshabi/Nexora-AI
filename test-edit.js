const currentState = {
  websiteProps: { name: "Test Site" },
  tokens: { colors: { primary: "#000000" } },
  pages: [],
  activePageId: "none"
};

const formData = new FormData();
formData.append("prompt", "change primary color to red");
formData.append("currentState", JSON.stringify(currentState));

fetch("http://localhost:3000/api/edit", {
  method: "POST",
  body: formData
}).then(res => res.text()).then(console.log).catch(console.error);
