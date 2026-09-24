import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../../src/lib/v5/localization/catalog.ts";
test("v5 localization/catalog exports",()=>{assert.ok(Object.keys(m).length>0);});
