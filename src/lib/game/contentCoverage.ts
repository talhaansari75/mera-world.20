import { EXTENDED_WORDS } from "./extendedWords.ts";
import { ALL_WORDS } from "./words.ts";
import { buildCatalog } from "../content/levelCatalog.ts";
import { puzzleForLevel } from "./levels.ts";
import { validatePuzzleQuality } from "../v16/core/puzzleQuality.ts";
import { LANGS } from "./i18n.ts";
import { nativeWordCount } from "./languageWords.ts";

export const TARGET_WORD_COUNT = 5000;
export const TARGET_LEVEL_COUNT = 1000;

export type CoverageReport = {
  wordCount: number;
  levelCount: number;
  sampleLevels: number;
  validLevels: number;
  solvableLevels: number;
  uniqueLevels: number;
  averageQuality: number;
  meetsWordTarget: boolean;
  meetsLevelTarget: boolean;
  languageWordCounts: Record<string, number>;
  languagesWithNativeStarter: number;
};

export function buildCoverageReport(sampleCount = 100): CoverageReport {
  const catalog = buildCatalog(2000);
  const sampleLevels = Math.min(sampleCount, catalog.length);
  let validLevels = 0;
  let solvableLevels = 0;
  let uniqueLevels = 0;
  let qualityTotal = 0;

  for (let i = 1; i <= sampleLevels; i++) {
    const puzzle = puzzleForLevel(i);
    const quality = validatePuzzleQuality(puzzle, true);
    if (quality.valid) validLevels++;
    if (quality.solvable) solvableLevels++;
    if (quality.unique) uniqueLevels++;
    qualityTotal += quality.score;
  }

  const combined = new Set([...ALL_WORDS, ...EXTENDED_WORDS]);
  return {
    wordCount: combined.size,
    levelCount: catalog.length,
    sampleLevels,
    validLevels,
    solvableLevels,
    uniqueLevels,
    averageQuality: sampleLevels ? Number((qualityTotal / sampleLevels).toFixed(2)) : 0,
    meetsWordTarget: combined.size >= TARGET_WORD_COUNT,
    meetsLevelTarget: catalog.length >= TARGET_LEVEL_COUNT,
    languageWordCounts: Object.fromEntries(LANGS.map((lang) => [lang, nativeWordCount(lang)])),
    languagesWithNativeStarter: LANGS.filter((lang) => nativeWordCount(lang) > 0).length,
  };
}
