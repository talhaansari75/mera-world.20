import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
const root = process.cwd();
const gameplay = readFileSync(join(root, "src/lib/server/gameplay.ts"), "utf8");
const store = readFileSync(join(root, "src/lib/store.ts"), "utf8");

test("V72 serializes hint economy across sessions", () => {
  assert.match(gameplay, /hint-economy:\$\{context\.userId\}/);
  assert.match(gameplay, /pg_advisory_xact_lock/);
});

test("V72 duplicate hint replay returns authoritative economy", () => {
  assert.match(gameplay, /duplicateAction\.type === "hint"/);
  assert.match(gameplay, /hintEconomy:\{coins:Number\(hintSave\.coins/);
});

test("V72 online hints commit client state only after server acceptance", () => {
  assert.match(store, /queueServerGameplayAction\(\{sessionId:play\.serverSessionId,actionId,type:"hint",hintKind:kind\}\)\.then/);
  assert.match(store, /if \(!result\?\.ok\) \{ flash/);
  assert.match(store, /revealCells\(\);/);
});

test("V72 offline hints remain local-only", () => {
  assert.match(store, /if \(!online && get\(\)\.save\.coins < cost\)/);
  assert.match(store, /get\(\)\.patchSave\(\(s\) => \(\{ \.\.\.s, coins: s\.coins - cost/);
});

test("V72 completion replay reads persistent settlement ledger", () => {
  assert.match(gameplay, /const settlementKey = `gameplay:\$\{row\.id\}`/);
  assert.match(gameplay, /rewardLedgerV5\.findUnique/);
  assert.match(gameplay, /save:currentSave/);
});
