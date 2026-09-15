import test from "node:test";
import assert from "node:assert/strict";
import type { PlayerSave } from "./types.ts";
import {
  JOURNEY_WORLDS,
  chestClaimed,
  chestKey,
  claimJourneyChest,
  isJourneyBoss,
  journeyWorldForLevel,
  journeyWorldProgress,
} from "./journeyWorlds.ts";

function simulationSave(): PlayerSave {
  return {
    version: 52,
    playerName: "Simulation",
    avatarId: "default",
    classId: "detective",
    xp: 0, coins: 100, diamonds: 10, stars: 0, energy: 100, energyAt: 0,
    unlockedLevel: 1, results: {}, settings: {} as PlayerSave["settings"],
    ownedThemes: [], ownedAvatars: [], ownedPets: [], petLevels: {}, equippedPet: null,
    equippedTheme: "default" as PlayerSave["equippedTheme"], achievements: [], stats: {} as PlayerSave["stats"],
    lastDaily: null, lastSpin: null, lastLoginReward: null, skillPoints: 0,
    skills: { speed: 0, vision: 0, luck: 0 }, language: "en", storyChapter: 0,
    inventory: [], loginDays: 0, baseBuildings: {}, materials: {}, equipment: [], equippedEquipment: {},
    claimedAchievements: [], claimedMissions: [], claimedSeasonTiers: [],
  };
}

function completeLevel(save: PlayerSave, level: number): PlayerSave {
  return {
    ...save,
    unlockedLevel: Math.max(save.unlockedLevel, Math.min(2000, level + 1)),
    results: {
      ...save.results,
      [String(level)]: { stars: 3, timeMs: 10_000, found: 10, hints: 0, perfect: true },
    },
  };
}

test("V52 campaign simulation traverses all six worlds and boss gates in order", () => {
  let save = simulationSave();

  assert.equal(JOURNEY_WORLDS.length, 6);
  assert.equal(save.unlockedLevel, 1);

  for (let i = 0; i < JOURNEY_WORLDS.length; i++) {
    const world = JOURNEY_WORLDS[i]!;
    const nextWorld = JOURNEY_WORLDS[i + 1];

    assert.equal(journeyWorldForLevel(world.from).world, world.world);
    assert.equal(journeyWorldForLevel(world.to).world, world.world);
    assert.equal(isJourneyBoss(world.to), true);
    assert.equal(journeyWorldProgress(save, world), 0);

    // The world is locked until the previous world's final level is completed.
    assert.equal(save.unlockedLevel >= world.from, true);
    assert.equal(save.unlockedLevel < world.to, true);
    if (i > 0) assert.equal(claimJourneyChest(save, world.world), null);
    if (nextWorld) assert.equal(save.unlockedLevel < nextWorld.from, true);

    // Simulate every level in the world, not just the boss, so unlock progression
    // cannot accidentally skip levels or cross a world boundary early.
    for (let level = world.from; level <= world.to; level++) {
      assert.equal(save.unlockedLevel, level);
      assert.equal(isJourneyBoss(level), level === world.to);
      save = completeLevel(save, level);
    }
    assert.equal(save.unlockedLevel, world.to === 2000 ? 2000 : world.to + 1);
    assert.ok(save.results[String(world.to)]);
    assert.equal(journeyWorldProgress(save, world), 100);

    const beforeChest = { coins: save.coins, diamonds: save.diamonds };
    const opened = claimJourneyChest(save, world.world);
    assert.ok(opened, `world ${world.world} chest should unlock after boss completion`);
    save = opened!;
    assert.equal(chestClaimed(save, world.world), true);
    assert.ok(save.inventory.includes(chestKey(world.world)));
    assert.equal(save.coins, beforeChest.coins + world.chestCoins);
    assert.equal(save.diamonds, beforeChest.diamonds + world.chestDiamonds);

    // Chest claiming is idempotent: a second claim cannot duplicate rewards.
    assert.equal(claimJourneyChest(save, world.world), null);

    if (nextWorld) {
      assert.equal(save.unlockedLevel >= nextWorld.from, true);
      assert.equal(journeyWorldForLevel(nextWorld.from).world, nextWorld.world);
    }
  }

  // Final world cannot advance past the 2000-level campaign cap.
  assert.equal(save.unlockedLevel, 2000);
  assert.equal(save.results["2000"]?.stars, 3);
  assert.equal(chestClaimed(save, 6), true);
  assert.equal(save.inventory.filter(x => x.startsWith("journey-chest-")).length, 6);
});

test("V52 chest is blocked before its boss and unaffected by unrelated level results", () => {
  let save = simulationSave();
  save = completeLevel(save, 1);

  assert.equal(claimJourneyChest(save, 1), null);
  assert.equal(claimJourneyChest(save, 2), null);

  save = completeLevel(save, JOURNEY_WORLDS[0]!.to);
  const opened = claimJourneyChest(save, 1);
  assert.ok(opened);
  assert.equal(opened!.inventory.includes(chestKey(1)), true);
});
