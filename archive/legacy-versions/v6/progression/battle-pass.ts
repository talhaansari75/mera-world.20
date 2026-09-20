/** V6 platform module: progression/battle-pass. */

export type BattlePassId = string;

export interface BattlePassRecord {
  id: BattlePassId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createBattlePassId(prefix = "battle_pass"): BattlePassId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isBattlePassRecord(value: unknown): value is BattlePassRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
