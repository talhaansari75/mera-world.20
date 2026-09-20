/** V6 platform module: jobs/leaderboard-refresh. */

export type LeaderboardRefreshId = string;

export interface LeaderboardRefreshRecord {
  id: LeaderboardRefreshId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createLeaderboardRefreshId(prefix = "leaderboard_refresh"): LeaderboardRefreshId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isLeaderboardRefreshRecord(value: unknown): value is LeaderboardRefreshRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
