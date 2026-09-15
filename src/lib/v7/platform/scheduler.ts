/** V7 domain module: platform/scheduler. */
export type SchedulerId = string;
export interface SchedulerRecord { id: SchedulerId; createdAt: number; version: number }
export function createScheduler(id: SchedulerId): SchedulerRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidScheduler(value: unknown): value is SchedulerRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
