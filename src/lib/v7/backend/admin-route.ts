/** V7 domain module: backend/admin-route. */
export type AdminRouteId = string;
export interface AdminRouteRecord { id: AdminRouteId; createdAt: number; version: number }
export function createAdminRoute(id: AdminRouteId): AdminRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAdminRoute(value: unknown): value is AdminRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
