/** V7 domain module: personalization/history. */
export type HistoryId = string;
export interface HistoryRecord { id: HistoryId; createdAt: number; version: number }
export function createHistory(id: HistoryId): HistoryRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidHistory(value: unknown): value is HistoryRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
