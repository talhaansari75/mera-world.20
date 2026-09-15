/** V7 domain module: admin/reports. */
export type ReportsId = string;
export interface ReportsRecord { id: ReportsId; createdAt: number; version: number }
export function createReports(id: ReportsId): ReportsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidReports(value: unknown): value is ReportsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
