import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../../src/lib/v5/economy/wallet.ts";
test("v5 economy/wallet exports",()=>{assert.ok(Object.keys(m).length>0);});
