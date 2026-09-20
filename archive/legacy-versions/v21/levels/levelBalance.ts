import type { GameMode, LevelSpec } from "../../game/types";
import { MAX_LEVEL } from "../../game/constants";
import { specFor, modeMods, isBoss, worldOf } from "../../game/levels";

export type LevelBand = {
  from: number;
  to: number;
  label: string;
  targetSize: [number, number];
  targetWords: [number, number];
  targetMinLen: [number, number];
  targetMaxLen: [number, number];
};

export const LEVEL_BANDS: readonly LevelBand[] = [
  { from: 1, to: 100, label: "onboarding", targetSize: [8, 10], targetWords: [5, 6], targetMinLen: [3, 3], targetMaxLen: [6, 7] },
  { from: 101, to: 300, label: "foundation", targetSize: [8, 10], targetWords: [5, 8], targetMinLen: [3, 3], targetMaxLen: [6, 8] },
  { from: 301, to: 550, label: "advanced", targetSize: [8, 12], targetWords: [7, 10], targetMinLen: [3, 3], targetMaxLen: [8, 9] },
  { from: 551, to: 800, label: "expert", targetSize: [10, 14], targetWords: [10, 12], targetMinLen: [3, 4], targetMaxLen: [9, 10] },
  { from: 801, to: 1050, label: "master", targetSize: [10, 14], targetWords: [12, 14], targetMinLen: [4, 4], targetMaxLen: [10, 12] },
  { from: 1051, to: 1300, label: "legend", targetSize: [12, 16], targetWords: [14, 16], targetMinLen: [4, 5], targetMaxLen: [11, 14] },
  { from: 1301, to: 1650, label: "nightmare", targetSize: [14, 18], targetWords: [16, 20], targetMinLen: [4, 5], targetMaxLen: [13, 16] },
  { from: 1651, to: 2000, label: "apex", targetSize: [16, 20], targetWords: [18, 24], targetMinLen: [5, 6], targetMaxLen: [14, 20] },
];

export function levelBand(level: number): LevelBand {
  const n = Math.max(1, Math.min(MAX_LEVEL, level));
  return LEVEL_BANDS.find((band) => n >= band.from && n <= band.to) ?? LEVEL_BANDS[0]!;
}

export function difficultyScore(level: number, mode: GameMode = "classic"): number {
  const n = Math.max(1, Math.min(MAX_LEVEL, level));
  const spec = modeMods(mode, specFor(n));
  const sizePressure = Math.min(1, Math.max(0, (spec.size - 8) / 12));
  const wordPressure = Math.min(1, Math.max(0, (spec.wordCount - 5) / 19));
  const lengthPressure = Math.min(1, Math.max(0, (spec.maxLen - spec.minLen) / 15));
  const timePressure = spec.timeLimit ? Math.min(1, Math.max(0, 1 - spec.timeLimit / 180)) : 0;
  const bossPressure = isBoss(n) ? 0.12 : 0;
  return Math.round(Math.min(1, 0.28 * sizePressure + 0.34 * wordPressure + 0.24 * lengthPressure + 0.14 * timePressure + bossPressure) * 100);
}

export function validateLevelSpec(level: number, mode: GameMode = "classic"): string[] {
  const n = Math.max(1, Math.min(MAX_LEVEL, level));
  const spec = modeMods(mode, specFor(n));
  const band = levelBand(n);
  const errors: string[] = [];
  if (spec.size < band.targetSize[0] || spec.size > band.targetSize[1]) errors.push(`size ${spec.size} outside ${band.targetSize.join("-")}`);
  if (spec.wordCount < band.targetWords[0] || spec.wordCount > band.targetWords[1]) errors.push(`wordCount ${spec.wordCount} outside ${band.targetWords.join("-")}`);
  if (spec.minLen < band.targetMinLen[0] || spec.minLen > band.targetMinLen[1]) errors.push(`minLen ${spec.minLen} outside ${band.targetMinLen.join("-")}`);
  if (spec.maxLen < band.targetMaxLen[0] || spec.maxLen > band.targetMaxLen[1]) errors.push(`maxLen ${spec.maxLen} outside ${band.targetMaxLen.join("-")}`);
  if (spec.maxLen > spec.size) errors.push(`maxLen ${spec.maxLen} exceeds grid ${spec.size}`);
  if (spec.minLen > spec.maxLen) errors.push("minLen exceeds maxLen");
  return errors;
}

export function levelReport(level: number) {
  const n = Math.max(1, Math.min(MAX_LEVEL, level));
  return {
    level: n,
    world: worldOf(n).id,
    band: levelBand(n).label,
    classic: specFor(n),
    difficulty: difficultyScore(n),
    boss: isBoss(n),
    errors: validateLevelSpec(n),
  };
}
