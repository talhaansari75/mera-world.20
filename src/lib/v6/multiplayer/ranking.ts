/** V6 platform module: multiplayer/ranking. */

export type RankingId = string;

export interface RankingRecord {
  id: RankingId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createRankingId(prefix = "ranking"): RankingId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isRankingRecord(value: unknown): value is RankingRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
