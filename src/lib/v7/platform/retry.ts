/** V7 domain module: platform/retry. */
export type RetryId = string;
export interface RetryRecord { id: RetryId; createdAt: number; version: number }
export function createRetry(id: RetryId): RetryRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRetry(value: unknown): value is RetryRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
