export type PetRarity = "common" | "rare" | "epic" | "legendary";

export type PetAbility =
  | "energy_saver"
  | "combo_guard"
  | "extra_coins"
  | "extra_xp"
  | "reveal"
  | "time_boost";

export type PetProfile = {
  id: string;
  name: string;
  rarity: PetRarity;
  ability: PetAbility;
  basePower: number;
  maxLevel: number;
};

export const PET_PROFILES: readonly PetProfile[] = [
  { id: "dog", name: "Lucky Dog", rarity: "common", ability: "energy_saver", basePower: 3, maxLevel: 20 },
  { id: "cat", name: "Clever Cat", rarity: "common", ability: "extra_coins", basePower: 4, maxLevel: 20 },
  { id: "eagle", name: "Sky Eagle", rarity: "rare", ability: "reveal", basePower: 5, maxLevel: 25 },
  { id: "wolf", name: "Streak Wolf", rarity: "rare", ability: "combo_guard", basePower: 6, maxLevel: 25 },
  { id: "fox", name: "Golden Fox", rarity: "epic", ability: "extra_xp", basePower: 8, maxLevel: 30 },
  { id: "dragon", name: "Time Dragon", rarity: "legendary", ability: "time_boost", basePower: 10, maxLevel: 40 },
];

export function petProfile(id: string | null | undefined) {
  return PET_PROFILES.find((p) => p.id === id) ?? null;
}

export function petPower(id: string | null | undefined, level: number) {
  const p = petProfile(id);
  if (!p) return 0;
  return p.basePower + Math.max(0, level - 1);
}

export function petUpgradeCost(id: string, level: number) {
  const p = petProfile(id);
  if (!p) return Number.MAX_SAFE_INTEGER;
  const rarity = { common: 1, rare: 2, epic: 4, legendary: 8 }[p.rarity];
  return Math.floor(60 * rarity * Math.pow(1.28, Math.max(0, level - 1)));
}

export function petEffect(id: string | null | undefined, level: number) {
  const p = petProfile(id);
  if (!p) return {};
  const power = petPower(id, level);

  switch (p.ability) {
    case "energy_saver": return { energyReductionPercent: Math.min(25, power) };
    case "combo_guard": return { comboGuard: Math.min(3, Math.floor(power / 4)) };
    case "extra_coins": return { coinBonusPercent: Math.min(40, power * 2) };
    case "extra_xp": return { xpBonusPercent: Math.min(50, power * 2) };
    case "reveal": return { startingReveals: Math.min(3, Math.ceil(power / 5)) };
    case "time_boost": return { timeBonusPercent: Math.min(30, power * 2) };
    default: return {};
  }
}

export function inventoryCount(inventory: string[], id: string) {
  return inventory.filter((x) => x === id).length;
}
