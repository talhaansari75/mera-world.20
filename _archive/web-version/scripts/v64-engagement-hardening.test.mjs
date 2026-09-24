import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const levels = fs.readFileSync(path.join(root, "src/lib/game/levels.ts"), "utf8");
const gameplay = fs.readFileSync(path.join(root, "src/lib/server/gameplay.ts"), "utf8");
const play = fs.readFileSync(path.join(root, "src/components/play/PlayScreen.tsx"), "utf8");
const engagement = fs.readFileSync(path.join(root, "src/lib/game/engagement.ts"), "utf8");

test("V64 keeps the core satisfaction target inside 60-120 seconds", () => {
  assert.match(levels, /Math\.max\(60_000, Math\.min\(120_000/);
});

test("V64 adaptive pacing is shared by client and server", () => {
  assert.match(gameplay, /(?:adaptivePlan|intelligenceAdaptivePlan)\(/);
  assert.match(gameplay, /adaptiveTier/);
  assert.match(play, /adaptiveTier/);
  assert.match(engagement, /export function adaptivePlan/);
});

test("V64 expert players receive a real, server-checked bonus objective", () => {
  assert.match(gameplay, /adaptiveBonusTarget/);
  assert.match(gameplay, /Expert mastery objective not completed/);
  assert.match(engagement, /Find 1 bonus word/);
});

test("V64 exposes multiple visible short-term goals during gameplay", () => {
  assert.match(play, /shortTermGoals\(/);
  assert.match(play, /aria-label="Short term goals"/);
  assert.match(play, /Next challenge/);
});
