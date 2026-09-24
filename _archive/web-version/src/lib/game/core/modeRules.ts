import type { GameMode } from "../types.ts";

export type ModeRules = {
  id: GameMode;
  name: string;
  description: string;
  difficulty: 0 | 1 | 2 | 3 | 4 | 5;
  free: boolean;
  timeMultiplier: number;
  energyMultiplier: number;
  rewardMultiplier: number;
  maxMistakes?: number;
  noHints?: boolean;
  reverseOnly?: boolean;
  diagonalOnly?: boolean;
  orthogonalOnly?: boolean;
  dense?: boolean;
};

const rule = (
  id: GameMode,
  name: string,
  description: string,
  difficulty: ModeRules["difficulty"],
  opts: Partial<Omit<ModeRules, "id" | "name" | "description" | "difficulty">> = {},
): ModeRules => ({
  id, name, description, difficulty, free: false,
  timeMultiplier: 1, energyMultiplier: 1, rewardMultiplier: 1, ...opts,
});

export const ADVANCED_MODE_CATALOG: ModeRules[] = [
  rule("classic", "Classic", "Balanced journey.", 1),
  rule("timed", "Time Attack", "Beat the clock.", 2, { timeMultiplier: .75, rewardMultiplier: 1.2 }),
  rule("survival", "Survival", "Three mistakes end the run.", 3, { maxMistakes: 3, rewardMultiplier: 1.35 }),
  rule("blitz", "Blitz", "A very short round.", 4, { timeMultiplier: .5, rewardMultiplier: 1.5 }),
  rule("zen", "Zen", "No energy and no clock.", 0, { free: true, rewardMultiplier: .8 }),
  rule("daily", "Daily", "One deterministic challenge each day.", 3, { free: true, timeMultiplier: .9 }),
  rule("endless", "Endless", "Procedural rounds without a cap.", 4, { free: true, rewardMultiplier: 1.25 }),
  rule("fog", "Fog", "Visibility is restricted.", 4, { rewardMultiplier: 1.35 }),
  rule("mirror", "Mirror", "Words are displayed backwards.", 3, { rewardMultiplier: 1.2 }),
  rule("category", "Category", "A themed vocabulary set.", 2),
  rule("boss", "Boss", "Dense board and strict timer.", 5, { timeMultiplier: .7, rewardMultiplier: 1.8, dense: true }),
  rule("rush", "Rush", "Every second matters.", 3, { timeMultiplier: .6, rewardMultiplier: 1.45 }),
  rule("precision", "Precision", "A single mistake is costly.", 4, { maxMistakes: 1, rewardMultiplier: 1.6 }),
  rule("hardcore", "Hardcore", "No mistakes allowed.", 5, { maxMistakes: 1, timeMultiplier: .8, rewardMultiplier: 2 }),
  rule("double_reward", "Double Reward", "Higher stakes, higher payout.", 2, { energyMultiplier: 1.5, rewardMultiplier: 2 }),
  rule("no_hints", "No Hints", "Hints are disabled.", 3, { noHints: true, rewardMultiplier: 1.5 }),
  rule("small_grid", "Pocket Grid", "Compact board with dense words.", 3, { rewardMultiplier: 1.3 }),
  rule("giant_grid", "Giant Grid", "A huge board for experts.", 4, { timeMultiplier: 1.25, rewardMultiplier: 1.7, dense: true }),
  rule("reverse_only", "Reverse Only", "Find trails in reverse.", 3, { reverseOnly: true, rewardMultiplier: 1.3 }),
  rule("diagonal", "Diagonal", "Only diagonal trails count.", 4, { diagonalOnly: true, rewardMultiplier: 1.55 }),
  rule("orthogonal", "Crossroads", "Only horizontal and vertical trails.", 3, { orthogonalOnly: true, rewardMultiplier: 1.35 }),
  rule("chaos", "Chaos", "Fast and unpredictable.", 5, { timeMultiplier: .7, rewardMultiplier: 1.9, dense: true }),
  rule("streak", "Streak", "Protect your combo.", 3, { rewardMultiplier: 1.6 }),
  rule("treasure", "Treasure Hunt", "Bonus rewards for clean clears.", 2, { rewardMultiplier: 1.75 }),
  rule("nightmare", "Nightmare", "Maximum pressure.", 5, { timeMultiplier: .55, maxMistakes: 1, rewardMultiplier: 2.25, dense: true }),
  rule("focus", "Focus", "A calm precision challenge.", 2, { timeMultiplier: 1.5, rewardMultiplier: 1.15 }),
  rule("speedrun", "Speedrun", "Race for your best time.", 4, { timeMultiplier: .45, rewardMultiplier: 1.8 }),
  rule("marathon", "Marathon", "Long-form endurance.", 3, { timeMultiplier: 2, rewardMultiplier: 1.4 }),
  rule("random_rules", "Random Rules", "A different modifier each run.", 5, { timeMultiplier: .8, rewardMultiplier: 1.9 }),
];

export const MODE_RULES: Record<GameMode, ModeRules> = Object.fromEntries(
  ADVANCED_MODE_CATALOG.map((m) => [m.id, m]),
) as Record<GameMode, ModeRules>;

export function modeRules(mode: GameMode): ModeRules {
  return MODE_RULES[mode] ?? MODE_RULES.classic;
}
