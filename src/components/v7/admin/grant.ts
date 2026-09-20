/** V7 domain module: admin/grant. */
export type GrantId = string;
export interface GrantRecord { id: GrantId; createdAt: number; version: number }
export function createGrant(id: GrantId): GrantRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidGrant(value: unknown): value is GrantRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
