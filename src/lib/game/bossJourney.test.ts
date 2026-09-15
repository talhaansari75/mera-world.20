import assert from "node:assert/strict";
import test from "node:test";
import { allJourneyBosses, bossPhase } from "./bossJourney.ts";
import { combatTurn, startCombat } from "./combat.ts";

test("six campaign bosses resolve to world endpoints", () => {
  const bosses = allJourneyBosses();
  assert.equal(bosses.length, 6);
  assert.deepEqual(bosses.map((b) => b.world), [1,2,3,4,5,6]);
  assert.deepEqual(bosses.map((b) => b.level), [333,666,999,1333,1666,2000]);
  assert.ok(bosses.every((b) => b.name.length > 0 && b.title.length > 0));
});

test("boss phases move at two thirds and one third HP", () => {
  assert.equal(bossPhase(100, 100), 1);
  assert.equal(bossPhase(66, 100), 2);
  assert.equal(bossPhase(33, 100), 3);
  assert.equal(bossPhase(0, 100), 3);
});

test("pet combo guard is a one-time boss protection and phase changes are observable", () => {
  let state = startCombat(333, 80);
  state = { ...state, enemy: { ...state.enemy, hp: 60, maxHp: 100, phase: 1 }, playerHp: 100 };
  const next = combatTurn(state, 10, "guard", false, "combo_guard");
  assert.equal(next.petAbilityUsed, true);
  assert.ok(next.petAbilityUsed);
  const phaseTwo = { ...next, enemy: { ...next.enemy, hp: 30, maxHp: 100, phase: 2 } };
  const final = combatTurn(phaseTwo, 120, "power", true);
  assert.equal(final.victory, true);
  assert.match(final.lastEvent, /FINAL WORD/);
});
