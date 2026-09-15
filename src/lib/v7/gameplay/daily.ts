/** V7 domain module: gameplay/daily. */
export type DailyId = string;
export interface DailyRecord { id: DailyId; createdAt: number; version: number }
export function createDaily(id: DailyId): DailyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDaily(value: unknown): value is DailyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
