/** V7 domain module: creator/revisions. */
export type RevisionsId = string;
export interface RevisionsRecord { id: RevisionsId; createdAt: number; version: number }
export function createRevisions(id: RevisionsId): RevisionsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRevisions(value: unknown): value is RevisionsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
