/** V6 platform module: admin/permissions. */

export type PermissionsId = string;

export interface PermissionsRecord {
  id: PermissionsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPermissionsId(prefix = "permissions"): PermissionsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPermissionsRecord(value: unknown): value is PermissionsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
