/** V6 platform module: platform/cache. */

export type CacheId = string;

export interface CacheRecord {
  id: CacheId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createCacheId(prefix = "cache"): CacheId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCacheRecord(value: unknown): value is CacheRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
