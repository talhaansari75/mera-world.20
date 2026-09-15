import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../../src/lib/v5/offline/actionQueue.ts";
test("v5 offline/actionQueue exports",()=>{assert.ok(Object.keys(m).length>0);});
