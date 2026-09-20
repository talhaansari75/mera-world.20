/** V7 domain module: social/clan-ranks. */
export type ClanRanksId = string;
export interface ClanRanksRecord { id: ClanRanksId; createdAt: number; version: number }
export function createClanRanks(id: ClanRanksId): ClanRanksRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidClanRanks(value: unknown): value is ClanRanksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
