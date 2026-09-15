import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("V66 intelligence wiring is present and privacy-gated", () => {
  const type = readFileSync("src/lib/game/types.ts", "utf8");
  const persist = readFileSync("src/lib/game/persist.ts", "utf8");
  const home = readFileSync("src/components/screens/HomeScreens.tsx", "utf8");
  const settings = readFileSync("src/components/screens/MetaScreens.tsx", "utf8");
  const server = readFileSync("src/lib/server/gameplay.ts", "utf8");
  assert.match(type, /personalization: boolean/);
  assert.match(persist, /personalization: true/);
  assert.match(home, /recommendFor/);
  assert.match(home, /recommendLiveEvent/);
  assert.match(settings, /Personalized gameplay/);
  assert.match(server, /intelligenceAdaptivePlan/);
  assert.match(server, /personalizedRewardMultiplier/);
});
