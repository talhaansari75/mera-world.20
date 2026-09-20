/** V6 platform module: admin/player-search. */

export type PlayerSearchId = string;

export interface PlayerSearchRecord {
  id: PlayerSearchId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPlayerSearchId(prefix = "player_search"): PlayerSearchId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPlayerSearchRecord(value: unknown): value is PlayerSearchRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
