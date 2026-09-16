import { ENERGY_REFILL_MS, MAX_ENERGY, PLAYER_XP_PER_LEVEL } from "../constants.ts";
import type { PlayerSave } from "../types.ts";

export function refillEnergy(save: PlayerSave, now = Date.now()): PlayerSave {
  if (save.energy >= MAX_ENERGY) {
    return save;
  }

  const elapsed = Math.max(0, now - save.energyAt);
  const gained = Math.floor(elapsed / ENERGY_REFILL_MS);

  if (gained <= 0) return save;

  const energy = Math.min(MAX_ENERGY, save.energy + gained);
  const energyAt =
    energy === MAX_ENERGY
      ? now
      : save.energyAt + gained * ENERGY_REFILL_MS;

  return { ...save, energy, energyAt };
}

export function energyEta(save: PlayerSave, now = Date.now()) {
  if (save.energy >= MAX_ENERGY) return 0;

  const next = save.energyAt + ENERGY_REFILL_MS;
  return Math.max(0, next - now);
}

export function playerLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / PLAYER_XP_PER_LEVEL)) + 1;
}

export function xpForLevel(level: number) {
  const l = Math.max(1, level);
  return PLAYER_XP_PER_LEVEL * (l - 1) * (l - 1);
}

export function coinsForClear(opts: {
  stars: number;
  words: number;
  hints: number;
  perfect: boolean;
  boss: boolean;
  firstClear: boolean;
}) {
  let n = 12 + opts.stars * 8 + opts.words * 2;

  if (opts.perfect) n += 15;
  if (opts.boss) n += 40;
  if (opts.firstClear) n += 10;

  n -= opts.hints * 3;

  return Math.max(6, n);
}

export function xpForClear(opts: {
  size: number;
  stars: number;
  boss: boolean;
}) {
  return 18 + opts.size * 2 + opts.stars * 6 + (opts.boss ? 40 : 0);
}

export function starsFor(opts: {
  hints: number;
  timeMs: number;
  targetMs: number;
  mistakes: number;
}) {
  if (
    opts.hints === 0 &&
    opts.mistakes === 0 &&
    opts.timeMs <= opts.targetMs
  ) {
    return 3 as const;
  }

  if (opts.hints <= 1 && opts.mistakes <= 1) {
    return 2 as const;
  }

  return 1 as const;
}

export function rewardCoins(opts: {
  mode: string;
  stars: number;
  combo: number;
  hints: number;
  mistakes: number;
  wordCount: number;
  firstClear: boolean;
  boss: boolean;
}) {
  let coins = 12 + opts.stars * 8 + opts.wordCount * 2;

  if (opts.combo >= 5) coins += Math.min(30, opts.combo * 2);
  if (opts.hints === 0) coins += 10;
  if (opts.mistakes === 0) coins += 5;
  if (opts.firstClear) coins += 10;
  if (opts.boss) coins += 40;

  if (opts.mode === "double_reward") coins *= 2;
  if (opts.mode === "treasure") coins += 20;
  if (opts.mode === "hardcore" || opts.mode === "nightmare") coins += 15;

  coins -= opts.hints * 3;
  coins -= opts.mistakes;

  return Math.max(6, coins);
}

export function recordLevelResult(
  save: PlayerSave,
  level: number,
  result: import("../types.ts").LevelResult
): PlayerSave {
  const key = String(level);
  const previous = save.results[key];

  const shouldReplace =
    !previous ||
    result.stars > previous.stars ||
    (result.stars === previous.stars &&
      result.timeMs < previous.timeMs);

  return {
    ...save,
    results: shouldReplace
      ? { ...save.results, [key]: result }
      : save.results,
    unlockedLevel: Math.max(save.unlockedLevel, level + 1),
  };
}

export const SHOP = [
  {
    id: "energy-1",
    name: "Spark of focus",
    kind: "energy",
    amount: 1,
    coins: 50,
    diamonds: 0,
  },
  {
    id: "energy-5",
    name: "Lantern of hours",
    kind: "energy",
    amount: 5,
    coins: 200,
    diamonds: 0,
  },
  {
    id: "energy-full",
    name: "Full well",
    kind: "energy",
    amount: 20,
    coins: 0,
    diamonds: 1,
  },
  {
    id: "coins-pack",
    name: "Coin purse",
    kind: "coins",
    amount: 200,
    coins: 0,
    diamonds: 2,
  },
  {
    id: "hint-pack",
    name: "Scribe's pack",
    kind: "item",
    amount: 1,
    coins: 80,
    diamonds: 0,
    item: "hint-pack",
  },
  {
    id: "theme-parchment",
    name: "Parchment theme",
    kind: "theme",
    amount: 1,
    coins: 180,
    diamonds: 0,
    theme: "parchment",
  },
  {
    id: "theme-ocean",
    name: "Tide theme",
    kind: "theme",
    amount: 1,
    coins: 220,
    diamonds: 0,
    theme: "ocean",
  },
  {
    id: "theme-forest",
    name: "Canopy theme",
    kind: "theme",
    amount: 1,
    coins: 220,
    diamonds: 0,
    theme: "forest",
  },
  {
    id: "theme-ember",
    name: "Ember theme",
    kind: "theme",
    amount: 1,
    coins: 260,
    diamonds: 0,
    theme: "ember",
  },
  {
    id: "theme-orchid",
    name: "Orchid theme",
    kind: "theme",
    amount: 1,
    coins: 260,
    diamonds: 0,
    theme: "orchid",
  },
  {
    id: "theme-arctic",
    name: "Arctic theme",
    kind: "theme",
    amount: 1,
    coins: 300,
    diamonds: 0,
    theme: "arctic",
  },
  {
    id: "theme-sakura",
    name: "Sakura theme",
    kind: "theme",
    amount: 1,
    coins: 300,
    diamonds: 0,
    theme: "sakura",
  },
] as const;

export const SPIN_TABLE = [
  {
    w: 28,
    coins: 15,
    diamonds: 0,
    energy: 0,
    label: "+15 coins",
  },
  {
    w: 22,
    coins: 40,
    diamonds: 0,
    energy: 0,
    label: "+40 coins",
  },
  {
    w: 16,
    coins: 0,
    diamonds: 0,
    energy: 1,
    label: "+1 energy",
  },
  {
    w: 12,
    coins: 80,
    diamonds: 0,
    energy: 0,
    label: "+80 coins",
  },
  {
    w: 10,
    coins: 0,
    diamonds: 1,
    energy: 0,
    label: "+1 diamond",
  },
  {
    w: 7,
    coins: 0,
    diamonds: 0,
    energy: 3,
    label: "+3 energy",
  },
  {
    w: 4,
    coins: 200,
    diamonds: 0,
    energy: 0,
    label: "+200 coins",
  },
  {
    w: 1,
    coins: 0,
    diamonds: 3,
    energy: 0,
    label: "Jackpot",
  },
] as const;
