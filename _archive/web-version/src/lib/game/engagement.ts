import type { PetId, PlayerSave, Puzzle } from "./types.ts";
import { JOURNEY_WORLDS, journeyWorldForLevel } from "./journeyWorlds.ts";
import { specialTilesForPuzzle } from "./specialTiles.ts";

export const PET_XP_PER_CLEAR = 12;
export const PET_XP_PER_PERFECT = 8;
export const PET_XP_PER_BOSS = 20;

const PET_EVOLUTION_THRESHOLDS = [0, 100, 250, 500, 900] as const;

export function petXpEarned(input: { perfect: boolean; boss: boolean }) {
  return PET_XP_PER_CLEAR + (input.perfect ? PET_XP_PER_PERFECT : 0) + (input.boss ? PET_XP_PER_BOSS : 0);
}

export function petLevelFromXp(xp: number) {
  const safe = Math.max(0, Math.floor(xp));
  let level = 1;
  for (let i = 0; i < PET_EVOLUTION_THRESHOLDS.length; i++) {
    if (safe >= PET_EVOLUTION_THRESHOLDS[i]!) level = i + 1;
  }
  return level;
}

export function petXpProgress(xp: number) {
  const safe = Math.max(0, Math.floor(xp));
  const level = petLevelFromXp(safe);
  const current = PET_EVOLUTION_THRESHOLDS[level - 1] ?? 0;
  const next = PET_EVOLUTION_THRESHOLDS[level] ?? current;
  if (next === current) return { level, current, next: null, percent: 100 };
  return { level, current, next, percent: Math.round(((safe - current) / (next - current)) * 100) };
}

export function petEvolutionName(level: number) {
  return level >= 5 ? "Legendary" : level >= 4 ? "Radiant" : level >= 3 ? "Brave" : level >= 2 ? "Awakened" : "Companion";
}


export type AdaptiveTier = "assist" | "steady" | "expert";

/**
 * Lightweight, deterministic pacing based on the player's recent completed levels.
 * It changes pressure rather than secretly changing puzzle correctness.
 */
export function adaptivePlan(save: PlayerSave, level: number) {
  const recent = Object.entries(save.results)
    .filter(([k]) => /^\d+$/.test(k))
    .map(([k, result]) => ({ level: Number(k), result }))
    .filter((x) => x.level < level)
    .sort((a, b) => b.level - a.level)
    .slice(0, 5);
  if (recent.length < 3) {
    return { tier: "steady" as AdaptiveTier, timeMultiplier: 1, startingReveals: 0, bonusTarget: 0, surprise: false };
  }
  const struggling = recent.filter(({ result }) => result.stars <= 1 || result.timeMs > 120_000).length;
  const expert = recent.filter(({ result }) => result.stars === 3 && result.perfect).length;
  if (struggling >= 3) return { tier: "assist" as AdaptiveTier, timeMultiplier: 1.12, startingReveals: 1, bonusTarget: 0, surprise: false };
  if (expert >= 4) return { tier: "expert" as AdaptiveTier, timeMultiplier: 0.92, startingReveals: 0, bonusTarget: 1, surprise: true };
  return { tier: "steady" as AdaptiveTier, timeMultiplier: 1, startingReveals: 0, bonusTarget: 0, surprise: false };
}

export function shortTermGoals(input: { level: number; stars?: number; combo: number; found: number; total: number; bonus: number; daily?: boolean; adaptiveTier?: AdaptiveTier }) {
  const goals = [
    { id: "level", label: `Clear Level ${input.level}`, done: input.found >= input.total },
    { id: "stars", label: "Aim for 3 stars", done: (input.stars ?? 0) >= 3 },
    { id: "combo", label: "Build a x3 combo", done: input.combo >= 3 },
  ];
  if (input.daily) goals.push({ id: "daily", label: "Finish today's challenge", done: input.found >= input.total });
  if (input.bonus > 0 || input.adaptiveTier === "expert") goals.push({ id: "bonus", label: input.adaptiveTier === "expert" ? "Find 1 bonus word" : "Find a bonus word", done: input.bonus > 0 });
  return goals.slice(0, 4);
}

export function worldRestoration(save: PlayerSave, world = journeyWorldForLevel(save.unlockedLevel)) {
  const total = world.to - world.from + 1;
  let completed = 0;
  for (let level = world.from; level <= world.to; level++) {
    if (save.results[String(level)]) completed++;
  }
  const percent = Math.round((completed / total) * 100);
  const stage = percent >= 100 ? "complete" : percent >= 80 ? "thriving" : percent >= 60 ? "expansion" : percent >= 40 ? "restoration" : percent >= 20 ? "discovery" : "untouched";
  return { completed, total, percent, stage } as const;
}

export function nextChallengePreview(level: number, puzzle: Puzzle) {
  const kinds = [...new Set(specialTilesForPuzzle(puzzle).map((tile) => tile.kind))];
  if (level > 0 && level % 25 === 0) return { label: "Boss Gate", detail: journeyWorldForLevel(level).boss, icon: "🐉" };
  if (kinds.includes("moving")) return { label: "Moving Obstacles", detail: "The grid shifts while you search", icon: "🌪️" };
  if (kinds.includes("bomb")) return { label: "Bomb Tiles", detail: "Watch the blast zone", icon: "💣" };
  if (kinds.includes("ice")) return { label: "Ice Tiles", detail: "Frozen cells briefly lock your input", icon: "❄️" };
  if (kinds.includes("locked")) return { label: "Locked Letters", detail: "Paths stop at locked cells", icon: "🔒" };
  if (level % 7 === 0) return { label: "Golden Word", detail: "Chain a combo for a bonus", icon: "✨" };
  return { label: "Fresh Puzzle", detail: "A new word set awaits", icon: "🧩" };
}

export function worldJourneySnapshot(save: PlayerSave) {
  return JOURNEY_WORLDS.map((world) => ({
    world: world.world,
    name: world.name,
    unlocked: save.unlockedLevel >= world.from,
    complete: Boolean(save.results[String(world.to)]),
    restoration: worldRestoration(save, world),
  }));
}

export function petXpFor(pet: PetId | null, save: PlayerSave) {
  return pet ? (save.petXp?.[pet] ?? 0) : 0;
}
