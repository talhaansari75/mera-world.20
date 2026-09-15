/** V7 domain module: notifications/dedupe. */
export type DedupeId = string;
export interface DedupeRecord { id: DedupeId; createdAt: number; version: number }
export function createDedupe(id: DedupeId): DedupeRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDedupe(value: unknown): value is DedupeRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
