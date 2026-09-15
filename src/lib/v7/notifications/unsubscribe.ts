/** V7 domain module: notifications/unsubscribe. */
export type UnsubscribeId = string;
export interface UnsubscribeRecord { id: UnsubscribeId; createdAt: number; version: number }
export function createUnsubscribe(id: UnsubscribeId): UnsubscribeRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidUnsubscribe(value: unknown): value is UnsubscribeRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
