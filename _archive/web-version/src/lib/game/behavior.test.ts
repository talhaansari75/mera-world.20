import test from "node:test";
import assert from "node:assert/strict";
import { behaviorRecommendation, defaultBehaviorProfile, observeCompletion, observeFailure, observeQuit } from "./behavior.ts";
import type { PlayerSave } from "./types.ts";

function save(): PlayerSave {
  return { version: 2, playerName: "Traveler", avatarId: "ink-1", classId: "explorer", xp: 0, coins: 100, diamonds: 5, stars: 0, energy: 20, energyAt: Date.now(), unlockedLevel: 10, results: {}, settings: {} as PlayerSave["settings"], ownedThemes: [], ownedAvatars: [], ownedPets: ["dog"], petLevels: {dog:1}, petXp:{dog:0}, equippedPet:"dog", equippedTheme:"midnight", achievements:[], stats:{} as PlayerSave["stats"], lastDaily:null, dailyStreak:0, lastSpin:null, lastLoginReward:null, skillPoints:0, skills:{speed:0,vision:0,luck:0}, language:"en", storyChapter:0, inventory:[], loginDays:1, baseBuildings:{camp:1,workshop:1,forge:1,library:1,treasury:1}, materials:{wood:0,stone:0,crystal:0,iron:0,gold:0}, equipment:[], equippedEquipment:{}, claimedAchievements:[], claimedMissions:[], claimedSeasonTiers:[], behaviorProfile: defaultBehaviorProfile() };
}

test("behavior model learns speed, pet and category affinity without identity data", () => {
  const next = observeCompletion(save(), {level:4,world:1,category:"Nature",mode:"speedrun",timeMs:45000,hints:0,combo:6,perfect:true,stars:3,pet:"dog",rewardCoins:120});
  assert.equal(next.behaviorProfile.preferred_categories[0], "Nature");
  assert.ok(next.behaviorProfile.speed_preference > 50);
  assert.ok(next.behaviorProfile.pet_affinity > 50);
  assert.equal(next.behaviorProfile.completions, 1);
});

test("failure and quit signals produce gentle assist recommendation", () => {
  let s = save();
  for (let i=0;i<4;i++) s = observeFailure(s, 7);
  s = observeQuit(s, 7);
  assert.equal(behaviorRecommendation(s).id, "assist");
});

test("expert profile gets mastery recommendation", () => {
  let s = save();
  for (let i=0;i<5;i++) s = observeCompletion(s, {level:i+1,world:1,category:"Speed",mode:"speedrun",timeMs:50000,hints:0,combo:8,perfect:true,stars:3,pet:null,rewardCoins:100});
  assert.ok(["speed","hard"].includes(behaviorRecommendation(s).id));
});
