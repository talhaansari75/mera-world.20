import type { GameMode, LevelResult, PlayerSave } from "../types.ts";
import { MAX_LEVEL } from "../constants.ts";

export type RewardContext = {
  mode: GameMode;
  stars: 1 | 2 | 3;
  combo: number;
  hints: number;
  mistakes: number;
  wordCount: number;
  firstClear: boolean;
  boss: boolean;
};

export function comboMultiplier(combo: number): number {
  return combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
}

export function rewardCoins(ctx: RewardContext): number {
  const base = ctx.wordCount * 2 + ctx.stars * 8;
  const mode = ctx.mode === "blitz" || ctx.mode === "timed" ? 1.25 : ctx.mode === "zen" ? 0.8 : 1;
  const clean = ctx.hints === 0 && ctx.mistakes === 0 ? 12 : 0;
  const first = ctx.firstClear ? 20 : 0;
  const boss = ctx.boss ? 35 : 0;
  return Math.max(1, Math.floor((base + clean + first + boss) * mode * comboMultiplier(ctx.combo)));
}

export function resultKey(kind: "level" | "daily" | "endless", level: number, day: string): string {
  if (kind === "daily") return `daily-${day}`;
  if (kind === "endless") return `end-${level}`;
  return String(level);
}

export function recordLevelResult(save: PlayerSave, level: number, result: LevelResult): PlayerSave {
  const key = String(level);
  const previous = save.results[key];
  const better = !previous || result.stars > previous.stars || (result.stars === previous.stars && result.timeMs < previous.timeMs);
  if (!better) return save;
  return {
    ...save,
    results: { ...save.results, [key]: result },
    unlockedLevel: Math.min(MAX_LEVEL, Math.max(save.unlockedLevel, level + 1)),
  };
}
