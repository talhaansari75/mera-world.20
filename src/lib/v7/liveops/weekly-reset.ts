/** V7 domain module: liveops/weekly-reset. */
export type WeeklyResetId = string;
export interface WeeklyResetRecord { id: WeeklyResetId; createdAt: number; version: number }
export function createWeeklyReset(id: WeeklyResetId): WeeklyResetRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidWeeklyReset(value: unknown): value is WeeklyResetRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
