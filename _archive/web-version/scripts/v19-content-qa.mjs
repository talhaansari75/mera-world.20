import fs from "node:fs";
import vm from "node:vm";

const extText = fs.readFileSync(new URL("../src/lib/game/extendedWords.ts", import.meta.url), "utf8");
const match = extText.match(/export const EXTENDED_WORDS = (\[[\s\S]*?\]) as const;/);
if (!match) throw new Error("extended word bank missing");
const words = vm.runInNewContext(`(${match[1]})`);
const unique = new Set(words);
if (unique.size < 5000) throw new Error(`word target failed: ${unique.size}`);
if ([...unique].some(w => !/^[A-Z]{3,14}$/.test(w))) throw new Error("invalid word in extended bank");
const levelText = fs.readFileSync(new URL("../src/lib/game/levels.ts", import.meta.url), "utf8");
const maxLevel = Number(levelText.match(/to: 2000/) ? 2000 : 0);
if (maxLevel < 1000) throw new Error("level target failed");
console.log(JSON.stringify({ ok:true, extendedUniqueWords:unique.size, levelCatalogMax:maxLevel, targetWords:5000, targetLevels:1000 }, null, 2));
