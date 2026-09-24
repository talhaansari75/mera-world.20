import type { Puzzle } from "../types.ts";

export type PuzzleValidation = {
  valid: boolean;
  errors: string[];
};

export function validatePuzzle(puzzle: Puzzle): PuzzleValidation {
  const errors: string[] = [];
  const n = puzzle.size;

  if (n < 2 || puzzle.grid.length !== n) errors.push("Invalid grid size");
  if (puzzle.grid.some((row) => row.length !== n)) errors.push("Grid is not square");
  if (puzzle.words.length !== puzzle.placements.length) errors.push("Word/placement count mismatch");

  const seen = new Set<string>();
  for (const placement of puzzle.placements) {
    if (seen.has(placement.word)) errors.push(`Duplicate word: ${placement.word}`);
    seen.add(placement.word);

    if (placement.cells.length !== placement.word.length) {
      errors.push(`Cell count mismatch: ${placement.word}`);
      continue;
    }

    for (let i = 0; i < placement.cells.length; i++) {
      const [row, col] = placement.cells[i]!;
      if (row < 0 || col < 0 || row >= n || col >= n) {
        errors.push(`Out-of-bounds placement: ${placement.word}`);
        break;
      }
      if (puzzle.grid[row]?.[col] !== placement.word[i]) {
        errors.push(`Grid mismatch: ${placement.word}`);
        break;
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
