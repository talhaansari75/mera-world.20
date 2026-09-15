/** V7 domain module: liveops/daily-reset. */
export type DailyResetId = string;
export interface DailyResetRecord { id: DailyResetId; createdAt: number; version: number }
export function createDailyReset(id: DailyResetId): DailyResetRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDailyReset(value: unknown): value is DailyResetRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
