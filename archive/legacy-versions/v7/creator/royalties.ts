/** V7 domain module: creator/royalties. */
export type RoyaltiesId = string;
export interface RoyaltiesRecord { id: RoyaltiesId; createdAt: number; version: number }
export function createRoyalties(id: RoyaltiesId): RoyaltiesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRoyalties(value: unknown): value is RoyaltiesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
