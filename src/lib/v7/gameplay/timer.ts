/** V7 domain module: gameplay/timer. */
export type TimerId = string;
export interface TimerRecord { id: TimerId; createdAt: number; version: number }
export function createTimer(id: TimerId): TimerRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidTimer(value: unknown): value is TimerRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
