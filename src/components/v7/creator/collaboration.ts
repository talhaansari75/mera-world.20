/** V7 domain module: creator/collaboration. */
export type CollaborationId = string;
export interface CollaborationRecord { id: CollaborationId; createdAt: number; version: number }
export function createCollaboration(id: CollaborationId): CollaborationRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCollaboration(value: unknown): value is CollaborationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
