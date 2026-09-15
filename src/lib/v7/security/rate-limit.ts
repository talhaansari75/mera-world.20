/** V7 domain module: security/rate-limit. */
export type RateLimitId = string;
export interface RateLimitRecord { id: RateLimitId; createdAt: number; version: number }
export function createRateLimit(id: RateLimitId): RateLimitRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRateLimit(value: unknown): value is RateLimitRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
