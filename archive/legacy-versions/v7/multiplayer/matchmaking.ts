/** V7 domain module: multiplayer/matchmaking. */
export type MatchmakingId = string;
export interface MatchmakingRecord { id: MatchmakingId; createdAt: number; version: number }
export function createMatchmaking(id: MatchmakingId): MatchmakingRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidMatchmaking(value: unknown): value is MatchmakingRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
