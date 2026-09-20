/** V7 domain module: platform/cache-policy. */
export type CachePolicyId = string;
export interface CachePolicyRecord { id: CachePolicyId; createdAt: number; version: number }
export function createCachePolicy(id: CachePolicyId): CachePolicyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCachePolicy(value: unknown): value is CachePolicyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
