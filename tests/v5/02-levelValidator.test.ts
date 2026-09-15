import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../../src/lib/v5/content/levelValidator.ts";
test("v5 content/levelValidator exports",()=>{assert.ok(Object.keys(m).length>0);});
