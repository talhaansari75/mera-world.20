import type { Dir, GameMode, LevelSpec } from "./types.ts";
import { DIRS_4, DIRS_8, MAX_LEVEL } from "./constants.ts";
import { hashSeed } from "./rng.ts";
import { generatePuzzle, pickCategory } from "./generator.ts";
import { CATEGORY_IDS } from "./words.ts";
import { mulberry32 } from "./rng.ts";
import type { LangCode } from "./types.ts";

export const WORLDS = [
  { id: "meadow", name: "Green Meadows", from: 1, to: 333, blurb: "Where the first words awaken." },
  { id: "crystal", name: "Crystal Caves", from: 334, to: 666, blurb: "Echoes beneath the earth." },
  { id: "desert", name: "Ancient Desert", from: 667, to: 999, blurb: "The atlas buried in gold." },
  { id: "frozen", name: "Frozen Kingdom", from: 1000, to: 1333, blurb: "Break the silence of the ice." },
  { id: "shadow", name: "Shadow Forest", from: 1334, to: 1666, blurb: "Where hidden words move." },
  { id: "sky", name: "Sky Islands", from: 1667, to: 2000, blurb: "The final archive above the clouds." },
] as const;

export function worldOf(level: number) {
  return WORLDS.find((w) => level >= w.from && level <= w.to) ?? WORLDS[0]!;
}

export function isBoss(level: number) {
  // Guardian battles are reserved for the six narrative World Gates.
  // Regular 25-level milestones remain progression milestones, not bosses.
  return level > 0 && WORLDS.some((w) => level === w.to);
}

export function specFor(level: number): LevelSpec {
  const n = Math.max(1, Math.min(MAX_LEVEL, level));
  const tier = Math.floor((n - 1) / 250);
  const size = Math.min(20, 8 + Math.floor(n / 220) * 2);
  const wordCount = Math.min(24, 5 + Math.floor(n / 110));
  const minLen = Math.min(6, 3 + Math.floor(n / 700));
  const maxLen = Math.min(size, 6 + Math.floor(n / 140));
  const directions: Dir[] = tier === 0 ? DIRS_4.slice() : DIRS_8.slice();
  const reverseWeight = Math.min(0.75, 0.12 + n / 3000);
  const baseTime = Math.max(35, 12 + size * 2.2 + wordCount * 3.5);
  const timeLimit = isBoss(n) ? Math.round(baseTime * 0.75) : undefined;
  return { size, wordCount, directions, minLen, maxLen, reverseWeight, timeLimit };
}

export function modeMods(mode: GameMode, spec: LevelSpec): LevelSpec {
  const next = { ...spec, directions: spec.directions.slice() };
  if (mode === "blitz") {
    next.timeLimit = Math.max(35, Math.floor((spec.timeLimit ?? 75) * 0.55));
  } else if (mode === "timed") {
    next.timeLimit = spec.timeLimit ?? 20 * spec.size;
  } else if (mode === "boss") {
    next.wordCount += 2;
    next.timeLimit = spec.timeLimit ?? 120;
  } else if (mode === "zen" || mode === "endless") {
    next.timeLimit = undefined;
  } else if (mode === "small_grid") {
    next.size = Math.max(8, spec.size - 2);
    next.wordCount = Math.max(5, spec.wordCount - 1);
    next.maxLen = Math.min(next.maxLen, next.size - 1);
  } else if (mode === "giant_grid") {
    next.size = Math.min(20, spec.size + 4);
    next.wordCount = Math.min(24, spec.wordCount + 3);
    next.maxLen = Math.min(next.size, next.maxLen + 2);
  } else if (mode === "diagonal") {
    next.directions = DIRS_8.filter(([dr, dc]) => Math.abs(dr) === 1 && Math.abs(dc) === 1) as Dir[];
  } else if (mode === "orthogonal") {
    next.directions = DIRS_4.slice() as Dir[];
  } else if (mode === "rush" || mode === "speedrun") {
    next.timeLimit = Math.max(25, Math.floor((spec.timeLimit ?? 90) * 0.6));
  } else if (mode === "nightmare" || mode === "chaos") {
    next.wordCount = Math.min(24, spec.wordCount + 3);
    next.timeLimit = Math.max(25, Math.floor((spec.timeLimit ?? 100) * 0.55));
  } else if (mode === "marathon") {
    next.wordCount = Math.min(24, spec.wordCount + 5);
    next.timeLimit = spec.timeLimit ? Math.floor(spec.timeLimit * 2) : undefined;
  } else if (mode === "focus") {
    next.timeLimit = spec.timeLimit ? Math.floor(spec.timeLimit * 1.5) : undefined;
  } else if (mode === "hardcore" || mode === "precision") {
    next.timeLimit = spec.timeLimit ? Math.floor(spec.timeLimit * 0.8) : undefined;
  } else if (mode === "random_rules") {
    const roll = Math.abs(levelHash(mode, spec.size, spec.wordCount)) % 4;
    if (roll === 0) next.directions = DIRS_4.slice() as Dir[];
    if (roll === 1) next.directions = DIRS_8.filter(([dr, dc]) => Math.abs(dr) === Math.abs(dc)) as Dir[];
    if (roll === 2) next.timeLimit = Math.max(25, Math.floor((spec.timeLimit ?? 90) * 0.65));
    if (roll === 3) next.wordCount = Math.min(24, spec.wordCount + 4);
  }
  return next;
}

export function puzzleForLevel(level: number, mode: GameMode = "classic", language: LangCode = "en") {
  const spec = modeMods(mode, specFor(level));
  const seed = hashSeed("mwsj", level, mode);
  const rng = mulberry32(seed);
  const category = CATEGORY_IDS[level % CATEGORY_IDS.length]!;
  const dirs = weightedDirs(spec, rng);
  const world = worldOf(level);
  return generatePuzzle({
    seed,
    size: spec.size,
    wordCount: spec.wordCount,
    minLen: spec.minLen,
    maxLen: spec.maxLen,
    dirs,
    category: pickCategory(rng, category),
    title: isBoss(level) ? `Boss ${level}` : `${world.name} ${level}`,
    language,
    script: ["ur", "sd", "ps"].includes(language) ? "urdu" : "latin",
  });
}

export function puzzleForDaily(dayKey: string, language: LangCode = "en", dailyChallengeId?: string) {
  const seed = hashSeed("daily", dayKey);
  const spec = specFor(250);
  return generatePuzzle({
    seed,
    size: 12,
    wordCount: 10,
    minLen: 4,
    maxLen: 9,
    dirs: DIRS_8,
    category: pickCategory(mulberry32(seed)),
    title: `Daily ${dayKey}`,
    dailyChallengeId,
    language,
    script: ["ur", "sd", "ps"].includes(language) ? "urdu" : "latin",
  });
}

export function puzzleEndless(round: number, seedBase: number, language: LangCode = "en") {
  const seed = hashSeed("endless", seedBase, round);
  const size = 8 + (round % 5) * 2;
  return generatePuzzle({
    seed,
    size: Math.min(16, size),
    wordCount: 5 + (round % 8),
    minLen: 3,
    maxLen: Math.min(10, size - 1),
    dirs: round % 2 === 0 ? DIRS_4 : DIRS_8,
    category: pickCategory(mulberry32(seed)),
    title: `Endless ${round + 1}`,
    language,
    script: ["ur", "sd", "ps"].includes(language) ? "urdu" : "latin",
  });
}

function levelHash(a: string, b: number, c: number) {
  return hashSeed("mode", a, b, c);
}

function weightedDirs(spec: LevelSpec, rng: () => number): Dir[] {
  const dirs = spec.directions.slice() as Dir[];
  if (spec.reverseWeight <= 0) return dirs;
  // Reverse directions already included in DIRS_8; this biases placement later.
  void rng;
  return dirs;
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function targetTimeMs(level: number, wordCount: number, size: number) {
  return Math.max(60_000, Math.min(120_000, (8 + size * 1.6 + wordCount * 4) * 1000));
}
