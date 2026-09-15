/** V7 domain module: backend/profile-route. */
export type ProfileRouteId = string;
export interface ProfileRouteRecord { id: ProfileRouteId; createdAt: number; version: number }
export function createProfileRoute(id: ProfileRouteId): ProfileRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidProfileRoute(value: unknown): value is ProfileRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
