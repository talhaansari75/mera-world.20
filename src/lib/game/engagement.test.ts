import test from "node:test";
import assert from "node:assert/strict";
import type { PlayerSave } from "./types.ts";
import { JOURNEY_WORLDS } from "./journeyWorlds.ts";
import { nextChallengePreview, petLevelFromXp, petXpEarned, petXpProgress, worldRestoration } from "./engagement.ts";

function saveWithResults(levels: number[]): PlayerSave {
  const base = {
    version: 54, playerName: "Test", avatarId: "default", classId: "detective" as const,
    xp: 0, coins: 0, diamonds: 0, stars: 0, energy: 100, energyAt: 0, unlockedLevel: 1,
    results: {}, settings: {} as PlayerSave["settings"], ownedThemes: [], ownedAvatars: [],
    ownedPets: ["dog" as const], petLevels: { dog: 1 }, petXp: { dog: 0 }, equippedPet: "dog" as const,
    equippedTheme: "midnight" as const, achievements: [], stats: {} as PlayerSave["stats"], lastDaily: null,
    lastSpin: null, lastLoginReward: null, skillPoints: 0, skills: { speed: 0, vision: 0, luck: 0 },
    language: "en" as const, storyChapter: 0, inventory: [], loginDays: 0, baseBuildings: {}, materials: {},
    equipment: [], equippedEquipment: {}, claimedAchievements: [], claimedMissions: [], claimedSeasonTiers: [],
  } satisfies PlayerSave;
  for (const level of levels) base.results[String(level)] = { stars: 3, timeMs: 1000, found: 5, hints: 0, perfect: true };
  base.unlockedLevel = Math.min(2000, Math.max(1, ...levels.map((x) => x + 1)));
  return base;
}

test("V54 pet XP scales with perfect and boss clears", () => {
  assert.equal(petXpEarned({ perfect: false, boss: false }), 12);
  assert.equal(petXpEarned({ perfect: true, boss: false }), 20);
  assert.equal(petXpEarned({ perfect: true, boss: true }), 40);
  assert.equal(petLevelFromXp(0), 1);
  assert.equal(petLevelFromXp(100), 2);
  assert.equal(petLevelFromXp(500), 4);
  assert.equal(petXpProgress(110).percent, 7);
});

test("V54 living-world restoration reflects real completed levels", () => {
  const world = JOURNEY_WORLDS[0]!;
  const save = saveWithResults([1, 2, 3, 4]);
  const state = worldRestoration(save, world);
  assert.equal(state.completed, 4);
  assert.equal(state.percent, 1);
  assert.equal(state.stage, "untouched");
});

test("V54 next-level preview uses deterministic gameplay mechanics", () => {
  const preview = nextChallengePreview(7, {
    id: "test", seed: 7, size: 8, grid: Array.from({ length: 8 }, () => Array(8).fill("A")),
    words: ["TEST"], placements: [{ word: "TEST", row: 0, col: 0, dr: 0, dc: 1, cells: [[0,0],[0,1],[0,2],[0,3]] }], category: "test", title: "Test"
  });
  assert.ok(preview.label.length > 0);
  assert.ok(preview.icon.length > 0);
});
