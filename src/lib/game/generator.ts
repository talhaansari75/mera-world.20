import type { Dir, Placement, Puzzle } from "./types.ts";
import { DIRS_8, FILL_LETTERS } from "./constants.ts";
import { mulberry32, pick, pickN, shuffle } from "./rng.ts";
import { URDU_WORDS, wordsInRange } from "./words.ts";
import { nativeWordsFor } from "./languageWords.ts";
import type { LangCode } from "./types.ts";
import { EXTENDED_WORDS } from "./extendedWords.ts";
import { validatePuzzle } from "./core/puzzleValidator.ts";
import { validatePuzzleQuality } from "../v16/core/puzzleQuality.ts";

export function canPlace(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  dr: number,
  dc: number,
): boolean {
  const n = grid.length;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || c < 0 || r >= n || c >= n) return false;
    const cell = grid[r]![c]!;
    if (cell && cell !== word[i]) return false;
  }
  return true;
}

export function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  dr: number,
  dc: number,
): Array<[number, number]> {
  const cells: Array<[number, number]> = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    grid[r]![c] = word[i]!;
    cells.push([r, c]);
  }
  return cells;
}

function tryPlace(
  grid: string[][],
  word: string,
  dirs: readonly Dir[],
  rng: () => number,
): Placement | null {
  const n = grid.length;
  const coords: Array<[number, number]> = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) coords.push([r, c]);
  shuffle(rng, coords);
  const dorder = shuffle(rng, dirs.slice() as Dir[]);
  for (const [dr, dc] of dorder) {
    for (const [row, col] of coords) {
      if (canPlace(grid, word, row, col, dr, dc)) {
        const cells = placeWord(grid, word, row, col, dr, dc);
        return { word, row, col, dr, dc, cells };
      }
    }
  }
  return null;
}

export function generatePuzzle(opts: {
  seed: number;
  size: number;
  wordCount: number;
  minLen: number;
  maxLen: number;
  dirs: readonly Dir[];
  category?: string;
  title?: string;
  script?: "latin" | "urdu";
  language?: LangCode;
}): Puzzle {
  const size = opts.size;
  const latinMax = Math.min(opts.maxLen, size);
  const language = opts.language ?? (opts.script === "urdu" ? "ur" : "en");
  const native = nativeWordsFor(language);
  const nativeMin = ["zh", "ja"].includes(language) ? Math.max(1, opts.minLen - 1) : opts.minLen;
  const pool = opts.script === "urdu"
    ? URDU_WORDS.filter((w) => w.length >= Math.max(2, opts.minLen - 1) && w.length <= opts.maxLen)
    : native.filter((w) => Array.from(w).length >= nativeMin && Array.from(w).length <= latinMax);

  // Preserve language/category flavor first. English extended words remain an
  // explicit fallback so every supported language can still generate offline.
  const categoryPool = language === "en" ? wordsInRange(opts.minLen, latinMax, opts.category) : [];
  const extended = EXTENDED_WORDS.filter((w) => w.length >= opts.minLen && w.length <= latinMax);
  const candidates = opts.script === "urdu"
    ? (pool.length ? pool : URDU_WORDS)
    : Array.from(new Set([...pool, ...categoryPool, ...(language === "en" ? extended : [])]));
  const wanted = Math.min(opts.wordCount, candidates.length);
  const alphabet = opts.script === "urdu" ? "ابپتٹثجچحخدڈذرڑزژسشصضطظعغفقکگلمنوهیے" : (language === "zh" ? "天地人日月山水火木金" : language === "ja" ? "あいうえおかきくけこさしすせそたちつてと" : FILL_LETTERS);

  // A deterministic retry loop makes dense/boss puzzles much less likely to
  // ship with fewer words than requested while preserving the same seed.
  for (let attempt = 0; attempt < 12; attempt++) {
    const rng = mulberry32((opts.seed + attempt * 0x9e3779b9) >>> 0);
    const picked = pickN(rng, candidates, Math.min(wanted + 12, candidates.length));
    picked.sort((a, b) => b.length - a.length);

    const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
    const placements: Placement[] = [];
    const used = new Set<string>();

    for (const word of picked) {
      if (placements.length >= wanted) break;
      if (used.has(word)) continue;
      const p = tryPlace(grid, word, opts.dirs.length ? opts.dirs : DIRS_8, rng);
      if (p) {
        placements.push(p);
        used.add(word);
      }
    }

    if (placements.length < wanted) {
      const extra = candidates.filter((w) => !used.has(w));
      shuffle(rng, extra);
      for (const word of extra) {
        if (placements.length >= wanted) break;
        const p = tryPlace(grid, word, opts.dirs.length ? opts.dirs : DIRS_8, rng);
        if (p) {
          placements.push(p);
          used.add(word);
        }
      }
    }

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!grid[row]![col]) grid[row]![col] = alphabet[Math.floor(rng() * alphabet.length)]!;
      }
    }

    const puzzle: Puzzle = {
      id: `p-${opts.seed}`,
      seed: opts.seed,
      size,
      grid,
      words: placements.map((p) => p.word),
      placements,
      category: opts.category ?? "mixed",
      title: opts.title ?? "Word Search",
    };

    if (placements.length >= wanted && validatePuzzle(puzzle).valid) {
      const quality = validatePuzzleQuality(puzzle, true);
      if (quality.solvable && (wanted < 3 || quality.unique)) return puzzle;
    }
  }

  // Guaranteed-solvable deterministic fallback: use non-overlapping row/column
  // lanes first, then the normal placement search. This prevents a dense level
  // from silently shipping with fewer target words just because the random pass
  // exhausted its attempts.
  const rng = mulberry32(opts.seed ^ 0xa5a5a5a5);
  const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
  const placements: Placement[] = [];
  const fallbackWords = candidates.slice().sort((a, b) => b.length - a.length).slice(0, wanted);
  const fallbackDirs: Dir[] = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  for (const word of fallbackWords) {
    let placed = false;
    for (const [dr, dc] of fallbackDirs) {
      for (let row = 0; row < size && !placed; row++) {
        for (let col = 0; col < size && !placed; col++) {
          if (!canPlace(grid, word, row, col, dr, dc)) continue;
          placements.push({ word, row, col, dr, dc, cells: placeWord(grid, word, row, col, dr, dc) });
          placed = true;
        }
      }
      if (placed) break;
    }
  }
  for (let row = 0; row < size; row++) for (let col = 0; col < size; col++) {
    if (!grid[row]![col]) grid[row]![col] = alphabet[Math.floor(rng() * alphabet.length)]!;
  }
  return { id: `p-${opts.seed}`, seed: opts.seed, size, grid, words: placements.map((p) => p.word), placements, category: opts.category ?? "mixed", title: opts.title ?? "Word Search" };
}

export function cellsAlong(r0: number, c0: number, r1: number, c1: number): Array<[number, number]> | null {
  const dr = Math.sign(r1 - r0);
  const dc = Math.sign(c1 - c0);
  const absR = Math.abs(r1 - r0);
  const absC = Math.abs(c1 - c0);
  if (absR !== 0 && absC !== 0 && absR !== absC) return null;
  const len = Math.max(absR, absC);
  const cells: Array<[number, number]> = [];
  for (let i = 0; i <= len; i++) cells.push([r0 + dr * i, c0 + dc * i]);
  return cells;
}

export function snapDir(dy: number, dx: number): [number, number] {
  if (dy === 0 && dx === 0) return [0, 0];
  const angle = Math.atan2(dy, dx);
  const snap = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  return [Math.round(Math.sin(snap)), Math.round(Math.cos(snap))];
}

export function pickCategory(rng: () => number, fallback?: string) {
  if (fallback) return fallback;
  return pick(rng, [
    "animals",
    "birds",
    "fruits",
    "vegetables",
    "countries",
    "cities",
    "sports",
    "nature",
    "food",
    "space",
    "ocean",
    "colors",
    "music",
    "islamic",
    "urdu",
  ]);
}
