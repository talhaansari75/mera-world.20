import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const root = process.cwd();
const must = [
  "public/sw.js",
  "src/lib/v29/pwa/pwa.ts",
  "src/components/v29/PwaScreen.tsx",
];
for (const f of must) if (!existsSync(join(root, f))) throw new Error(`missing ${f}`);
const sw = readFileSync(join(root, "public/sw.js"), "utf8");
if (!sw.includes("addEventListener(\"push\"")) throw new Error("push handler missing");
if (!sw.includes("SKIP_WAITING")) throw new Error("update handler missing");
const board = readFileSync(join(root, "src/components/play/GridBoard.tsx"), "utf8");
if (!board.includes("ArrowUp") || !board.includes("aria-activedescendant")) throw new Error("keyboard board support missing");
const types = readFileSync(join(root, "src/lib/game/types.ts"), "utf8");
if (!types.includes('| "pwa"')) throw new Error("pwa route missing");
console.log("V29 PWA/accessibility check: PASS");
