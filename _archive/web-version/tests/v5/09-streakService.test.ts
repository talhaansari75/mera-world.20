import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../../src/lib/v5/game/streakService.ts";
test("v5 game/streakService exports",()=>{assert.ok(Object.keys(m).length>0);});
