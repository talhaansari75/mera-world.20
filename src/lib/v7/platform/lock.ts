/** V7 domain module: platform/lock. */
export type LockId = string;
export interface LockRecord { id: LockId; createdAt: number; version: number }
export function createLock(id: LockId): LockRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidLock(value: unknown): value is LockRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
