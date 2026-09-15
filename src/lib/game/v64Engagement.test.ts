import test from "node:test";
import assert from "node:assert/strict";
import { adaptivePlan, shortTermGoals } from "./engagement.ts";

test("V64 adaptive plan gives subtle help to struggling players", () => {
  const save = { results: {
    "1": { stars: 1, timeMs: 150_000, found: 5, hints: 2, perfect: false },
    "2": { stars: 1, timeMs: 140_000, found: 5, hints: 1, perfect: false },
    "3": { stars: 1, timeMs: 130_000, found: 5, hints: 2, perfect: false },
  } } as any;
  const plan = adaptivePlan(save, 4);
  assert.equal(plan.tier, "assist");
  assert.equal(plan.startingReveals, 1);
  assert.ok(plan.timeMultiplier > 1);
});

test("V64 adaptive plan raises mastery pressure for expert streaks", () => {
  const save = { results: {
    "1": { stars: 3, timeMs: 45_000, found: 5, hints: 0, perfect: true },
    "2": { stars: 3, timeMs: 44_000, found: 5, hints: 0, perfect: true },
    "3": { stars: 3, timeMs: 43_000, found: 5, hints: 0, perfect: true },
    "4": { stars: 3, timeMs: 42_000, found: 5, hints: 0, perfect: true },
  } } as any;
  const plan = adaptivePlan(save, 5);
  assert.equal(plan.tier, "expert");
  assert.equal(plan.bonusTarget, 1);
  assert.equal(plan.surprise, true);
});

test("V64 short-term goals remain actionable during a run", () => {
  const goals = shortTermGoals({ level: 12, combo: 3, found: 4, total: 8, bonus: 1 });
  assert.equal(goals[0]?.done, false);
  assert.ok(goals.some((g) => g.id === "combo" && g.done));
  assert.ok(goals.some((g) => g.id === "bonus" && g.done));
});
