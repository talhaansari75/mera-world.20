import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../../src/lib/v5/multiplayer/roomProtocol.ts";
test("v5 multiplayer/roomProtocol exports",()=>{assert.ok(Object.keys(m).length>0);});
