/** V6 platform module: api/health. */

export type HealthId = string;

export interface HealthRecord {
  id: HealthId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createHealthId(prefix = "health"): HealthId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isHealthRecord(value: unknown): value is HealthRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
