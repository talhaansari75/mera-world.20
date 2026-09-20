/** V7 domain module: analytics/deletion. */
export type DeletionId = string;
export interface DeletionRecord { id: DeletionId; createdAt: number; version: number }
export function createDeletion(id: DeletionId): DeletionRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDeletion(value: unknown): value is DeletionRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
