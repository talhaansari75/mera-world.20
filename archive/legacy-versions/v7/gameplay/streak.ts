/** V7 domain module: gameplay/streak. */
export type StreakId = string;
export interface StreakRecord { id: StreakId; createdAt: number; version: number }
export function createStreak(id: StreakId): StreakRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidStreak(value: unknown): value is StreakRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
