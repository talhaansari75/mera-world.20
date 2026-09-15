import type { Puzzle } from "@/lib/game/types";
import { cellsAlong } from "@/lib/game/generator";

export type PuzzleQuality = {
  valid: boolean;
  solvable: boolean;
  unique: boolean;
  density: number;
  difficulty: number;
  occurrences: Record<string, number>;
  errors: string[];
};

function canonicalPath(cells: Array<[number, number]>) {
  const a = cells.map(([r, c]) => `${r}:${c}`).join("|");
  const b = [...cells].reverse().map(([r, c]) => `${r}:${c}`).join("|");
  return a < b ? a : b;
}

export function countWordOccurrences(puzzle: Puzzle, word: string): number {
  const n = puzzle.size;
  const target = word.toUpperCase();
  const paths = new Set<string>();
  const dirs = [-1, 0, 1].flatMap((dr) => [-1, 0, 1].map((dc) => [dr, dc] as const)).filter(([dr, dc]) => dr !== 0 || dc !== 0);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    for (const [dr, dc] of dirs) {
      const endR = r + dr * (target.length - 1);
      const endC = c + dc * (target.length - 1);
      if (endR < 0 || endC < 0 || endR >= n || endC >= n) continue;
      let ok = true;
      const cells: Array<[number, number]> = [];
      for (let i = 0; i < target.length; i++) {
        const rr = r + dr * i, cc = c + dc * i;
        if (puzzle.grid[rr]?.[cc]?.toUpperCase() !== target[i]) { ok = false; break; }
        cells.push([rr, cc]);
      }
      if (ok) paths.add(canonicalPath(cells));
    }
  }
  return paths.size;
}

export function puzzleDifficulty(puzzle: Puzzle): number {
  const area = puzzle.size * puzzle.size;
  const density = puzzle.words.length / Math.max(1, area);
  const lengths = puzzle.words.map((w) => w.length);
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
  const intersections = puzzle.placements.reduce((sum, p, i) => sum + puzzle.placements.slice(i + 1).filter((q) => p.cells.some((a) => q.cells.some((b) => a[0] === b[0] && a[1] === b[1]))).length, 0);
  const reverse = puzzle.placements.filter((p) => p.dr < 0 || p.dc < 0).length / Math.max(1, puzzle.placements.length);
  return Math.max(1, Math.min(100, Math.round(density * 140 + avg * 4 + intersections * 2 + reverse * 18)));
}

export function validatePuzzleQuality(puzzle: Puzzle, requireUnique = true): PuzzleQuality {
  const errors: string[] = [];
  const validWords = puzzle.words.every((w) => typeof w === "string" && w.length >= 2);
  if (!validWords) errors.push("invalid_word");
  const occurrences: Record<string, number> = {};
  for (const word of puzzle.words) {
    const count = countWordOccurrences(puzzle, word);
    occurrences[word] = count;
    if (count < 1) errors.push(`unsolved:${word}`);
    if (requireUnique && count !== 1) errors.push(`non_unique:${word}:${count}`);
  }
  const filled = puzzle.grid.flat().filter(Boolean).length;
  const density = filled / Math.max(1, puzzle.size * puzzle.size);
  const solvable = puzzle.words.every((w) => (occurrences[w] ?? 0) >= 1);
  const unique = puzzle.words.every((w) => (occurrences[w] ?? 0) === 1);
  return { valid: errors.length === 0, solvable, unique, density, difficulty: puzzleDifficulty(puzzle), occurrences, errors };
}

export function hasPlacement(puzzle: Puzzle, word: string): boolean {
  return puzzle.placements.some((p) => p.word === word && cellsAlong(p.row, p.col, p.row + p.dr * (word.length - 1), p.col + p.dc * (word.length - 1)) !== null);
}
