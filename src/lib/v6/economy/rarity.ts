/** V6 platform module: economy/rarity. */

export type RarityId = string;

export interface RarityRecord {
  id: RarityId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createRarityId(prefix = "rarity"): RarityId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isRarityRecord(value: unknown): value is RarityRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
