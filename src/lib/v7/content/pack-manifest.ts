/** V7 domain module: content/pack-manifest. */
export type PackManifestId = string;
export interface PackManifestRecord { id: PackManifestId; createdAt: number; version: number }
export function createPackManifest(id: PackManifestId): PackManifestRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPackManifest(value: unknown): value is PackManifestRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
