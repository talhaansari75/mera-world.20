/** V6 platform module: admin/support. */

export type SupportId = string;

export interface SupportRecord {
  id: SupportId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSupportId(prefix = "support"): SupportId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSupportRecord(value: unknown): value is SupportRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
