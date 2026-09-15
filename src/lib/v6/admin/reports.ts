/** V6 platform module: admin/reports. */

export type ReportsId = string;

export interface ReportsRecord {
  id: ReportsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createReportsId(prefix = "reports"): ReportsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isReportsRecord(value: unknown): value is ReportsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
