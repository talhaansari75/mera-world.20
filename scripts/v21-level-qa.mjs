import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const levels = fs.readFileSync(path.join(root, "src/lib/game/levels.ts"), "utf8");
const constants = fs.readFileSync(path.join(root, "src/lib/game/constants.ts"), "utf8");
const worlds = [...levels.matchAll(/from:\s*(\d+),\s*to:\s*(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
const max = Number(constants.match(/MAX_LEVEL\s*=\s*(\d+)/)?.[1] ?? 0);
const errors = [];
if (max < 1000) errors.push(`MAX_LEVEL ${max} is below 1000`);
if (worlds.length < 8) errors.push(`expected at least 8 worlds, found ${worlds.length}`);
for (let i = 0; i < worlds.length; i++) {
  const [from, to] = worlds[i];
  if (from > to) errors.push(`world ${i + 1} has inverted range`);
  if (i && from !== worlds[i - 1][1] + 1) errors.push(`world gap/overlap before ${from}`);
}
if (worlds[0]?.[0] !== 1 || worlds.at(-1)?.[1] !== max) errors.push("world ranges do not cover 1..MAX_LEVEL");
const generator = fs.readFileSync(path.join(root, "src/lib/game/generator.ts"), "utf8");
for (const needle of ["validatePuzzleQuality", "Guaranteed-solvable deterministic fallback", "fallbackDirs"]) {
  if (!generator.includes(needle)) errors.push(`generator missing ${needle}`);
}
if (errors.length) {
  console.error("V21 LEVEL QA FAILED");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`V21 LEVEL QA PASS — ${max} levels, ${worlds.length} continuous worlds, fallback + quality validation present`);
