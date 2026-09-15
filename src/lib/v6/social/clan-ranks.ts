/** V6 platform module: social/clan-ranks. */

export type ClanRanksId = string;

export interface ClanRanksRecord {
  id: ClanRanksId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createClanRanksId(prefix = "clan_ranks"): ClanRanksId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isClanRanksRecord(value: unknown): value is ClanRanksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
