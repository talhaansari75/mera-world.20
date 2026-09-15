/** V7 domain module: admin/revoke. */
export type RevokeId = string;
export interface RevokeRecord { id: RevokeId; createdAt: number; version: number }
export function createRevoke(id: RevokeId): RevokeRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRevoke(value: unknown): value is RevokeRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
