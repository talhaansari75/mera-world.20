import fs from "node:fs";
const required = [
  "src/lib/v14/content/languagePacks.ts",
  "src/lib/v14/liveops/seasonal.ts",
  "src/components/v14/ContentLanguagesScreen.tsx",
];
for (const file of required) if (!fs.existsSync(file)) throw new Error(`missing ${file}`);
const text = fs.readFileSync("src/lib/v14/content/languagePacks.ts", "utf8");
for (const code of ["en","ur","ur-Latn","hi","ar","bn","pa","sd","ps","tr","es","fr","de","zh","ja"]) {
  if (!text.includes(`code: "${code}"`)) throw new Error(`missing language ${code}`);
}
const live = fs.readFileSync("src/lib/v14/liveops/seasonal.ts", "utf8");
for (const cycle of ["daily","weekly","seasonal"]) if (!live.includes(`cycle: "${cycle}"`)) throw new Error(`missing cycle ${cycle}`);
console.log("V14 content/liveops integration check: PASS");
