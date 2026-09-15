import test from "node:test";
import assert from "node:assert/strict";
import { bonusSubmissionKey, bossRewardKey } from "./v61SecurityHelpers.ts";

test("bonus submissions canonicalize forward and reverse paths", () => {
  const a: [number,number][] = [[0,0],[0,1],[0,2]];
  const b: [number,number][] = [...a].reverse();
  assert.equal(bonusSubmissionKey("ABC", a), bonusSubmissionKey("ABC", b));
});

test("boss reward key is permanent per user and World Boss", () => {
  assert.equal(bossRewardKey("u1", 333), "boss-reward:u1:333");
  assert.notEqual(bossRewardKey("u1", 333), bossRewardKey("u1", 666));
  assert.notEqual(bossRewardKey("u1", 333), bossRewardKey("u2", 333));
});
