/** V7 domain module: backend/pet-route. */
export type PetRouteId = string;
export interface PetRouteRecord { id: PetRouteId; createdAt: number; version: number }
export function createPetRoute(id: PetRouteId): PetRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPetRoute(value: unknown): value is PetRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
