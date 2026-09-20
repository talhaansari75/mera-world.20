/** V7 domain module: content/pack-version. */
export type PackVersionId = string;
export interface PackVersionRecord { id: PackVersionId; createdAt: number; version: number }
export function createPackVersion(id: PackVersionId): PackVersionRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPackVersion(value: unknown): value is PackVersionRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
