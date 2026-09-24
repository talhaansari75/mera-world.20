export type MaterialId = "wood" | "stone" | "crystal" | "iron" | "gold";

export type BuildingId = "camp" | "workshop" | "forge" | "library" | "treasury";

export type EquipmentSlot = "weapon" | "armor" | "charm";

export type Material = { id: MaterialId; name: string; baseValue: number };

export const MATERIALS: readonly Material[] = [
  { id: "wood", name: "Wood", baseValue: 2 },
  { id: "stone", name: "Stone", baseValue: 3 },
  { id: "crystal", name: "Crystal", baseValue: 8 },
  { id: "iron", name: "Iron", baseValue: 10 },
  { id: "gold", name: "Gold", baseValue: 20 },
];

export const BUILDINGS: Record<BuildingId, { name: string; maxLevel: number; baseCost: number; effect: string }> = {
  camp: { name: "Journey Camp", maxLevel: 10, baseCost: 100, effect: "Increases base energy capacity." },
  workshop: { name: "Workshop", maxLevel: 10, baseCost: 140, effect: "Improves crafting efficiency." },
  forge: { name: "Forge", maxLevel: 10, baseCost: 180, effect: "Unlocks stronger equipment." },
  library: { name: "Word Library", maxLevel: 10, baseCost: 160, effect: "Improves word discovery rewards." },
  treasury: { name: "Treasury", maxLevel: 10, baseCost: 220, effect: "Improves bonus coin rewards." },
};

export type Equipment = {
  id: string;
  name: string;
  slot: EquipmentSlot;
  level: number;
  power: number;
  rarity: "common" | "rare" | "epic" | "legendary";
};

export function buildingUpgradeCost(id: BuildingId, level: number) {
  const b = BUILDINGS[id];
  if (level >= b.maxLevel) return null;
  return Math.floor(b.baseCost * Math.pow(1.35, level));
}

export function materialValue(id: MaterialId, amount: number) {
  const m = MATERIALS.find((x) => x.id === id);
  return (m?.baseValue ?? 0) * Math.max(0, amount);
}

export function craftEquipment(
  slot: EquipmentSlot,
  level: number,
  materials: Partial<Record<MaterialId, number>>,
): Equipment | null {
  const total = Object.entries(materials).reduce(
    (sum, [id, amount]) => sum + materialValue(id as MaterialId, Number(amount)),
    0,
  );
  if (total < 30 + level * 15) return null;

  const rarity = total >= 500 ? "legendary" : total >= 250 ? "epic" : total >= 120 ? "rare" : "common";
  const multiplier = { common: 1, rare: 1.35, epic: 1.8, legendary: 2.5 }[rarity];

  return {
    id: `crafted-${slot}-${Date.now()}`,
    name: `${rarity[0].toUpperCase() + rarity.slice(1)} ${slot}`,
    slot,
    level,
    power: Math.floor((10 + level * 7) * multiplier),
    rarity,
  };
}

export function equipmentPower(equipment: Equipment | null | undefined) {
  return equipment?.power ?? 0;
}
