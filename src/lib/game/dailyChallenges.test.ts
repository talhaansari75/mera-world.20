import assert from "node:assert/strict";
import test from "node:test";
import { allDailyChallenges, dailyChallengeFor, dailyChallengeRewardMultiplier, dailyChallengeObjective } from "./dailyChallenges.ts";
import { specialTilesForPuzzle } from "./specialTiles.ts";

test("daily challenge rotation is deterministic and covers the challenge pool", () => {
  const a = dailyChallengeFor("2026-09-15");
  const b = dailyChallengeFor("2026-09-15");
  assert.deepEqual(a, b);
  assert.equal(allDailyChallenges().length, 7);
  assert.ok(allDailyChallenges().every((x) => x.rewardMultiplier > 1));
});

test("daily challenge bonuses are bounded and condition-aware", () => {
  const perfect = dailyChallengeFor("2026-09-14");
  assert.ok(dailyChallengeRewardMultiplier(perfect, { perfect: false, combo: 0, bonusWords: 0 }) >= 1);
  assert.ok(dailyChallengeRewardMultiplier(perfect, { perfect: true, combo: 0, bonusWords: 0 }) <= 1.5);
  assert.equal(dailyChallengeRewardMultiplier(undefined, { perfect: true, combo: 99, bonusWords: 99 }), 1);
});


test("ice and bomb daily variants force their signature mechanic", () => {
  const base = { id: "daily", seed: 123, size: 6, grid: Array.from({length:6},()=>Array.from({length:6},()=>"A")), words: ["TREE"], placements: [{word:"TREE", row:0, col:0, dr:0, dc:1, cells:[[0,0],[0,1],[0,2],[0,3]]}], category:"nature", title:"Daily" };
  const ice = specialTilesForPuzzle({ ...base, dailyChallengeId: "ice" });
  const bomb = specialTilesForPuzzle({ ...base, dailyChallengeId: "bomb" });
  assert.ok(ice.some((x) => x.kind === "ice"));
  assert.ok(bomb.some((x) => x.kind === "bomb"));
});


test("daily objectives are explicit and enforceable", () => {
  const combo = { id: "combo", title: "", description: "", icon: "", rewardMultiplier: 1.15 } as const;
  assert.equal(dailyChallengeObjective(combo, { perfect: true, combo: 4, bonusWords: 0 }).met, false);
  assert.equal(dailyChallengeObjective(combo, { perfect: true, combo: 5, bonusWords: 0 }).met, true);
  const treasure = { id: "treasure", title: "", description: "", icon: "", rewardMultiplier: 1.15 } as const;
  assert.equal(dailyChallengeObjective(treasure, { perfect: true, combo: 9, bonusWords: 1 }).met, false);
  assert.equal(dailyChallengeObjective(treasure, { perfect: true, combo: 9, bonusWords: 2 }).met, true);
});
