import test from "node:test";
import assert from "node:assert/strict";
import { applyIntelligenceEvent, recommendFor, engagementSummary } from "./playerIntelligence.ts";
import { defaultSave } from "../game/persist.ts";

test("central intelligence learns only from gameplay signals", () => {
  let save = defaultSave();
  save = applyIntelligenceEvent(save, { type:"level_complete", level:3, world:1, category:"Nature", mode:"speedrun", timeMs:42000, hints:0, combo:7, stars:3, perfect:true, pet:"dog", rewardCoins:120 });
  assert.ok(save.behaviorProfile.skill_score > 50);
  assert.ok(save.behaviorProfile.speed_preference > 50);
  assert.ok(save.behaviorProfile.pet_affinity > 50);
  assert.deepEqual(save.behaviorProfile.preferred_categories, ["Nature"]);
});

test("opt-out freezes personalization", () => {
  const save = { ...defaultSave(), settings: { ...defaultSave().settings, personalization:false } };
  const next = applyIntelligenceEvent(save, { type:"level_complete", level:1, world:1, category:"Nature", mode:"classic", timeMs:30000, hints:0, combo:9, stars:3, perfect:true, pet:"dog", rewardCoins:100 });
  assert.deepEqual(next.behaviorProfile, save.behaviorProfile);
  assert.equal(recommendFor(next).id, "steady");
});

test("recommendation adapts toward speed and exposes a compact profile", () => {
  let save = defaultSave();
  for (let i=0;i<8;i++) save = applyIntelligenceEvent(save, { type:"level_complete", level:i+1, world:1, category:"Speed", mode:"speedrun", timeMs:45000, hints:0, combo:8, stars:3, perfect:true, pet:null, rewardCoins:100 });
  const rec = recommendFor(save);
  assert.ok(rec.id === "speed" || rec.id === "mastery");
  assert.ok(engagementSummary(save).speed > 50);
});
