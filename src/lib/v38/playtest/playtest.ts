import type { Puzzle } from "@/lib/game/types";

export type PlaytestResult = {
  puzzleId: string;
  title: string;
  completed: boolean;
  elapsedMs: number;
  mistakes: number;
  found: string[];
  score: number;
  testedAt: number;
};

const KEY = "mera-word-search-v38-playtests";

export function matchPlaytestPath(puzzle: Puzzle, letters: string, cells: Array<[number, number]>, found: string[]): string | null {
  const normalized = letters.replace(/[^A-Z]/g, "").toUpperCase();
  if (!normalized || cells.length < 2) return null;
  const already = new Set(found);
  for (const placement of puzzle.placements) {
    if (already.has(placement.word)) continue;
    const sameCells = placement.cells.length === cells.length && placement.cells.every(([r, c], i) => r === cells[i]![0] && c === cells[i]![1]);
    const reverseCells = placement.cells.length === cells.length && placement.cells.every(([r, c], i) => r === cells[cells.length - 1 - i]![0] && c === cells[cells.length - 1 - i]![1]);
    if ((sameCells || reverseCells) && (normalized === placement.word || normalized === placement.word.split("").reverse().join(""))) return placement.word;
  }
  return null;
}

export function scorePlaytest(total: number, elapsedMs: number, mistakes: number): number {
  const speedBonus = Math.max(0, 40 - Math.floor(elapsedMs / 15000));
  const accuracyBonus = Math.max(0, 40 - mistakes * 5);
  return Math.max(0, Math.min(100, Math.round((total ? 20 : 0) + speedBonus + accuracyBonus)));
}

export function savePlaytestResult(result: PlaytestResult) {
  try {
    const current = JSON.parse(localStorage.getItem(KEY) || "[]") as PlaytestResult[];
    localStorage.setItem(KEY, JSON.stringify([result, ...current].slice(0, 50)));
  } catch {}
}

export function listPlaytestResults(): PlaytestResult[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
