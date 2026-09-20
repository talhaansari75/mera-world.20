/** V7 domain module: platform/timeout. */
export type TimeoutId = string;
export interface TimeoutRecord { id: TimeoutId; createdAt: number; version: number }
export function createTimeout(id: TimeoutId): TimeoutRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidTimeout(value: unknown): value is TimeoutRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
