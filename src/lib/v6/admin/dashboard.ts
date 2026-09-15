/** V6 platform module: admin/dashboard. */

export type DashboardId = string;

export interface DashboardRecord {
  id: DashboardId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createDashboardId(prefix = "dashboard"): DashboardId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isDashboardRecord(value: unknown): value is DashboardRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
