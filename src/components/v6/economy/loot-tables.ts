/** V6 platform module: economy/loot-tables. */

export type LootTablesId = string;

export interface LootTablesRecord {
  id: LootTablesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createLootTablesId(prefix = "loot_tables"): LootTablesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isLootTablesRecord(value: unknown): value is LootTablesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
