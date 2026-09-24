import test from "node:test";
import assert from "node:assert/strict";
import { isJourneyBoss } from "./journeyWorlds.ts";
import { dailyChallengeObjective } from "./dailyChallenges.ts";

test("V60 boss gates are only six world endpoints", () => {
  assert.deepEqual([333,666,999,1333,1666,2000].map(isJourneyBoss), [true,true,true,true,true,true]);
  assert.equal(isJourneyBoss(25), false);
  assert.equal(isJourneyBoss(100), false);
});

test("V60 daily objectives remain strict", () => {
  assert.equal(dailyChallengeObjective({id:"combo",title:"",description:"",icon:"",rewardMultiplier:1},{perfect:false,combo:4,bonusWords:0}).met,false);
  assert.equal(dailyChallengeObjective({id:"combo",title:"",description:"",icon:"",rewardMultiplier:1},{perfect:false,combo:5,bonusWords:0}).met,true);
});
