/** V6 platform module: progression/daily. */

export type DailyId = string;

export interface DailyRecord {
  id: DailyId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createDailyId(prefix = "daily"): DailyId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isDailyRecord(value: unknown): value is DailyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
