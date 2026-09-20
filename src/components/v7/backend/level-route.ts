/** V7 domain module: backend/level-route. */
export type LevelRouteId = string;
export interface LevelRouteRecord { id: LevelRouteId; createdAt: number; version: number }
export function createLevelRoute(id: LevelRouteId): LevelRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidLevelRoute(value: unknown): value is LevelRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
