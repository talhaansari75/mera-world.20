/** V7 domain module: notifications/push. */
export type PushId = string;
export interface PushRecord { id: PushId; createdAt: number; version: number }
export function createPush(id: PushId): PushRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPush(value: unknown): value is PushRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
