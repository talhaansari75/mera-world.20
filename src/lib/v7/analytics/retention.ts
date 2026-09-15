/** V7 domain module: analytics/retention. */
export type RetentionId = string;
export interface RetentionRecord { id: RetentionId; createdAt: number; version: number }
export function createRetention(id: RetentionId): RetentionRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRetention(value: unknown): value is RetentionRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
