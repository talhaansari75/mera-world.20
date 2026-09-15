/** V6 platform module: jobs/daily-reset. */

export type DailyResetId = string;

export interface DailyResetRecord {
  id: DailyResetId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createDailyResetId(prefix = "daily_reset"): DailyResetId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isDailyResetRecord(value: unknown): value is DailyResetRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
