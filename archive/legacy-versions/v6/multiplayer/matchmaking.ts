/** V6 platform module: multiplayer/matchmaking. */

export type MatchmakingId = string;

export interface MatchmakingRecord {
  id: MatchmakingId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createMatchmakingId(prefix = "matchmaking"): MatchmakingId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isMatchmakingRecord(value: unknown): value is MatchmakingRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
