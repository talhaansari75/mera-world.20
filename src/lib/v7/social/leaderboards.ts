/** V7 domain module: social/leaderboards. */
export type LeaderboardsId = string;
export interface LeaderboardsRecord { id: LeaderboardsId; createdAt: number; version: number }
export function createLeaderboards(id: LeaderboardsId): LeaderboardsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidLeaderboards(value: unknown): value is LeaderboardsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
