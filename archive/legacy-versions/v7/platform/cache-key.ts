/** V7 domain module: platform/cache-key. */
export type CacheKeyId = string;
export interface CacheKeyRecord { id: CacheKeyId; createdAt: number; version: number }
export function createCacheKey(id: CacheKeyId): CacheKeyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCacheKey(value: unknown): value is CacheKeyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
