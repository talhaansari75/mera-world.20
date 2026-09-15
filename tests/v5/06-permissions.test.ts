import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../../src/lib/v5/admin/permissions.ts";
test("v5 admin/permissions exports",()=>{assert.ok(Object.keys(m).length>0);});
