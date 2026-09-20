/** V7 domain module: admin/permissions. */
export type PermissionsId = string;
export interface PermissionsRecord { id: PermissionsId; createdAt: number; version: number }
export function createPermissions(id: PermissionsId): PermissionsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPermissions(value: unknown): value is PermissionsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
