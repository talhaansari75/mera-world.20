/** V7 domain module: liveops/rotations. */
export type RotationsId = string;
export interface RotationsRecord { id: RotationsId; createdAt: number; version: number }
export function createRotations(id: RotationsId): RotationsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRotations(value: unknown): value is RotationsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
