/** V7 domain module: analytics/performance. */
export type PerformanceId = string;
export interface PerformanceRecord { id: PerformanceId; createdAt: number; version: number }
export function createPerformance(id: PerformanceId): PerformanceRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPerformance(value: unknown): value is PerformanceRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
