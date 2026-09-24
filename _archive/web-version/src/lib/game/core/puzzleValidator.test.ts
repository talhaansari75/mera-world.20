import test from "node:test";
import assert from "node:assert/strict";
import { generatePuzzle } from "../generator.ts";
import { validatePuzzle } from "./puzzleValidator.ts";
import { DIRS_8 } from "../constants.ts";

test("generated puzzle is internally consistent", () => {
  const puzzle = generatePuzzle({
    seed: 12345,
    size: 10,
    wordCount: 7,
    minLen: 3,
    maxLen: 8,
    dirs: DIRS_8,
    category: "animals",
  });
  assert.equal(validatePuzzle(puzzle).valid, true);
  assert.equal(puzzle.words.length, puzzle.placements.length);
  assert.ok(puzzle.words.length >= 1);
});
