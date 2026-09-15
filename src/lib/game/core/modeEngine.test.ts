import assert from "node:assert/strict";
import test from "node:test";
import { validateModePath, randomRuleFor } from "./modeEngine.ts";

const placement = { word: "TEST", row: 0, col: 0, dr: 0, dc: 1, cells: [[0,0],[0,1],[0,2],[0,3]] as Array<[number,number]> };
const diag = { ...placement, cells: [[0,0],[1,1],[2,2],[3,3]] as Array<[number,number]>, dr:1, dc:1 };

test("orthogonal accepts horizontal placement", () => assert.equal(validateModePath("orthogonal", placement.cells, [placement]).ok, true));
test("diagonal rejects horizontal placement", () => assert.equal(validateModePath("diagonal", placement.cells, [placement]).ok, false));
test("diagonal accepts diagonal placement", () => assert.equal(validateModePath("diagonal", diag.cells, [diag]).ok, true));
test("reverse-only rejects forward path", () => assert.equal(validateModePath("reverse_only", placement.cells, [placement]).ok, false));
test("reverse-only accepts reversed path", () => assert.equal(validateModePath("reverse_only", [...placement.cells].reverse(), [placement]).ok, true));
test("random rule is deterministic", () => assert.equal(randomRuleFor(123), randomRuleFor(123)));
