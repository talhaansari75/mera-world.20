/** V6 platform module: platform/maintenance. */

export type MaintenanceId = string;

export interface MaintenanceRecord {
  id: MaintenanceId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createMaintenanceId(prefix = "maintenance"): MaintenanceId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isMaintenanceRecord(value: unknown): value is MaintenanceRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
