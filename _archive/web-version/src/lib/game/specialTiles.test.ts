import test from "node:test";
import assert from "node:assert/strict";
import { clipAtLocked, movingPositions, specialKindsAt, specialTilesForPuzzle } from "./specialTiles.ts";
import type { Puzzle } from "./types.ts";

const puzzle: Puzzle = {
  id: "test",
  seed: 12345,
  size: 8,
  grid: Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => "A")),
  words: ["AAAA"],
  placements: [{ word: "AAAA", row: 0, col: 0, dr: 0, dc: 1, cells: [[0,0],[0,1],[0,2],[0,3]] }],
  category: "test",
  title: "Test",
};

test("special tiles are deterministic and never cover target word cells", () => {
  const a = specialTilesForPuzzle(puzzle);
  const b = specialTilesForPuzzle(puzzle);
  assert.deepEqual(a, b);
  const targets = new Set(puzzle.placements[0]!.cells.map(([r,c]) => `${r},${c}`));
  assert.equal(a.some(t => targets.has(`${t.cell[0]},${t.cell[1]}`)), false);
});

test("locked tiles stop a selection before the obstacle", () => {
  const specials = new Map([["0,2", "locked" as const]]);
  assert.deepEqual(clipAtLocked([[0,0],[0,1],[0,2],[0,3]], specials), [[0,0],[0,1]]);
});

test("special kinds are detected along a path", () => {
  const specials = new Map([["1,1", "bomb" as const], ["1,2", "ice" as const]]);
  assert.deepEqual([...specialKindsAt([[1,1],[1,2]], specials)].sort(), ["bomb", "ice"]);
});

test("moving obstacles relocate deterministically between ticks", () => {
  const tiles = [
    { kind: "moving" as const, cell: [2,2] as [number,number] },
    { kind: "moving" as const, cell: [2,3] as [number,number] },
  ];
  const t0 = movingPositions(tiles, 0);
  const t1 = movingPositions(tiles, 1);
  assert.equal(t0.get("2,2"), "moving");
  assert.equal(t1.get("2,3"), "moving");
  assert.notDeepEqual([...t0.entries()], [...t1.entries()]);
});
