/** V7 domain module: backend/game-route. */
export type GameRouteId = string;
export interface GameRouteRecord { id: GameRouteId; createdAt: number; version: number }
export function createGameRoute(id: GameRouteId): GameRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidGameRoute(value: unknown): value is GameRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
