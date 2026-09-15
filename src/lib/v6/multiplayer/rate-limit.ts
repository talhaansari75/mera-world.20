/** V6 platform module: multiplayer/rate-limit. */

export type RateLimitId = string;

export interface RateLimitRecord {
  id: RateLimitId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createRateLimitId(prefix = "rate_limit"): RateLimitId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isRateLimitRecord(value: unknown): value is RateLimitRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
