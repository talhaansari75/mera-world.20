/** V6 platform module: progression/weekly. */

export type WeeklyId = string;

export interface WeeklyRecord {
  id: WeeklyId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createWeeklyId(prefix = "weekly"): WeeklyId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isWeeklyRecord(value: unknown): value is WeeklyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
