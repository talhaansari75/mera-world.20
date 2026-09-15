/** V7 domain module: creator/analytics. */
export type AnalyticsId = string;
export interface AnalyticsRecord { id: AnalyticsId; createdAt: number; version: number }
export function createAnalytics(id: AnalyticsId): AnalyticsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAnalytics(value: unknown): value is AnalyticsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
