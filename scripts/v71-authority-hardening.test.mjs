import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
const root = process.cwd();
const gameplay = readFileSync(join(root, "src/lib/server/gameplay.ts"), "utf8");
const store = readFileSync(join(root, "src/lib/store.ts"), "utf8");

test("V71 hint economy is server-authoritative", () => {
  assert.match(gameplay, /HINT_COST/);
  assert.match(gameplay, /modeRules\(state\.mode\)\.noHints/);
  assert.match(gameplay, /coins < cost/);
  assert.match(gameplay, /coins:coins-cost/);
  assert.match(gameplay, /hintsUsed:Number\(stats\.hintsUsed \?\? 0\)\+1/);
  assert.match(store, /const online = typeof navigator !== "undefined" && navigator\.onLine && Boolean\(next\.serverSessionId\)/);
});

test("V71 rejects invalid action types instead of coercing to miss", () => {
  assert.match(gameplay, /const allowed = new Set\(\["found","bonus","miss","hint","pause","resume"\]\)/);
  assert.match(gameplay, /throw new Error\("Invalid gameplay action type\."\)/);
});

test("V71 completion settlement isolates leaderboard writes", () => {
  assert.match(gameplay, /return \{ok:true as const,duplicate:false,stars,coins,xp,save:next,leaderboard:/);
  assert.match(gameplay, /db\.\$transaction\(async tx => \{[\s\S]*?leaderboardScore\.create/);
  assert.match(gameplay, /catch \{ \/\* leaderboard is non-critical/);
});

test("V71 offline action IDs remain strict UUIDs", () => {
  assert.match(store, /const bytes = new Uint8Array\(16\)/);
  assert.match(store, /bytes\[6\].*0x40/);
  assert.match(store, /bytes\[8\].*0x80/);
});

test("V71 hint authority returns only authoritative economy values to the client", () => {
  assert.match(gameplay, /hintEconomy = \{ coins: coins - cost, hintsUsed:/);
  assert.doesNotMatch(store, /if \(result\.hintEconomy\) get\(\)\.applyServerSave/);
  assert.match(store, /result\.hintEconomy/);
});
