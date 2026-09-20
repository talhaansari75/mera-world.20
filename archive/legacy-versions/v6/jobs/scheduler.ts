/** V6 platform module: jobs/scheduler. */

export type SchedulerId = string;

export interface SchedulerRecord {
  id: SchedulerId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSchedulerId(prefix = "scheduler"): SchedulerId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSchedulerRecord(value: unknown): value is SchedulerRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
