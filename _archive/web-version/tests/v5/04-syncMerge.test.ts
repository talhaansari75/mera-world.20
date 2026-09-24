import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../../src/lib/v5/cloud/syncMerge.ts";
test("v5 cloud/syncMerge exports",()=>{assert.ok(Object.keys(m).length>0);});
