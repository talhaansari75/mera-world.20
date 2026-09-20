/** V6 platform module: social/leaderboards. */

export type LeaderboardsId = string;

export interface LeaderboardsRecord {
  id: LeaderboardsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createLeaderboardsId(prefix = "leaderboards"): LeaderboardsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isLeaderboardsRecord(value: unknown): value is LeaderboardsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
