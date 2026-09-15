/** V7 domain module: creator/versioning. */
export type VersioningId = string;
export interface VersioningRecord { id: VersioningId; createdAt: number; version: number }
export function createVersioning(id: VersioningId): VersioningRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidVersioning(value: unknown): value is VersioningRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
