import { generatePuzzle } from "@/lib/game/generator";
import { validatePuzzle } from "@/lib/game/core/puzzleValidator";
import { validatePuzzleQuality } from "@/lib/v16/core/puzzleQuality";
import type { Puzzle } from "@/lib/game/types";

export type PreviewResult = {
  puzzle: Puzzle;
  valid: boolean;
  quality: number;
  errors: string[];
};

const clean = (input: string[]) => [...new Set(input.map((w) => w.trim().toUpperCase().replace(/[^A-Z]/g, "")).filter((w) => /^[A-Z]{3,14}$/.test(w)))].slice(0, 12);

export function buildPlayablePreview(input: { words: string[]; category?: string; title?: string; seed?: number }): PreviewResult {
  const words = clean(input.words);
  const size = Math.max(10, Math.min(16, Math.max(10, ...words.map((w) => w.length))));
  const puzzle = generatePuzzle({
    seed: Number.isFinite(input.seed) ? Number(input.seed) : 37001 + words.length,
    size,
    wordCount: words.length,
    minLen: 3,
    maxLen: Math.min(14, size),
    dirs: [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],
    category: input.category?.trim().slice(0, 32) || "creator",
    title: input.title?.trim().slice(0, 48) || "Creator Preview",
  });
  const structural = validatePuzzle(puzzle);
  const quality = validatePuzzleQuality(puzzle, true);
  const score = Math.max(0, Math.min(100, Math.round((quality.solvable ? 65 : 20) + (quality.unique ? 25 : 0) + (structural.valid ? 10 : 0))));
  return { puzzle, valid: structural.valid && quality.solvable, quality: score, errors: [...structural.errors, ...quality.errors].slice(0, 8) };
}
