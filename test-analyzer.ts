import { analyzeDescription } from "./backend/lib/analyzeDescription";

const tests = [
  // The actual user prompt
  {
    input: "the business name is nexora, it a website building platform that uses AI power to build websites without the need to edit all the steps along the way",
    expName: "Nexora",
    expDesc: "Website building platform that uses AI power to build websites without the need to edit all the steps along the way",
  },
  // Variations
  {
    input: "the business name is nexora, a website building platform",
    expName: "Nexora",
    expDesc: "Website building platform",
  },
  {
    input: "business name is Acme Corp, it is a digital marketing agency",
    expName: "Acme Corp",
    expDesc: "Digital marketing agency",
  },
  // Original tests (regression check)
  { input: "A portfolio for Bloom Studio, a creative photography agency", expName: "Bloom Studio", expDesc: "Creative photography agency" },
  { input: "Build a website for my restaurant called The Golden Fork", expName: "The Golden Fork", expDesc: "Restaurant" },
  { input: "Create a modern site for TechVision AI - an artificial intelligence startup", expName: "TechVision AI", expDesc: "Artificial intelligence startup" },
  { input: "I need an online store for handmade jewelry by Luna Crafts", expName: "Luna Crafts", expDesc: "Handmade jewelry" },
  { input: "Landing page for FitLife Gym with pricing and class schedules", expName: "FitLife Gym", expDesc: "" },
  { input: "A luxury spa website for Serenity Wellness Center", expName: "Serenity Wellness Center", expDesc: "Luxury spa" },
  { input: "E-commerce site selling organic skincare products", expName: "", expDesc: "Selling organic skincare products" },
  { input: "A dark themed portfolio for a photographer with gallery section", expName: "", expDesc: "Photographer" },
  // Lowercase tests
  { input: "website for acme corp", expName: "Acme Corp", expDesc: "" },
  { input: "create a website for my bakery called sweet treats", expName: "Sweet Treats", expDesc: "Bakery" },
  { input: "online store for handmade jewelry by luna crafts", expName: "Luna Crafts", expDesc: "Handmade jewelry" },
  { input: "a portfolio for bloom studio, a creative agency", expName: "Bloom Studio", expDesc: "Creative agency" },
  { input: "landing page for fitlife gym with pricing", expName: "Fitlife Gym", expDesc: "" },
];

let pass = 0;
let fail = 0;
tests.forEach((t, i) => {
  const r = analyzeDescription(t.input);
  const name = r.businessName || "";
  const desc = r.businessDescription || "";
  const nameOk = name === t.expName;
  const descOk = desc === t.expDesc || (t.expDesc === "" && desc === "");
  const status = nameOk && descOk ? "✅" : "❌";
  if (nameOk && descOk) pass++;
  else fail++;
  console.log(`Test ${i + 1} ${status}: NAME="${name}" DESC="${desc}"`);
  if (!nameOk) console.log(`   ↳ Expected name: "${t.expName}"`);
  if (!descOk) console.log(`   ↳ Expected desc: "${t.expDesc}"`);
});
console.log(`\n${pass} passed, ${fail} failed`);
