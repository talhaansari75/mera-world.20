/** V7 domain module: backend/combat-route. */
export type CombatRouteId = string;
export interface CombatRouteRecord { id: CombatRouteId; createdAt: number; version: number }
export function createCombatRoute(id: CombatRouteId): CombatRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCombatRoute(value: unknown): value is CombatRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
