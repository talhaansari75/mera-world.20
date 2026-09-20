/** V6 platform module: economy/salvage. */

export type SalvageId = string;

export interface SalvageRecord {
  id: SalvageId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSalvageId(prefix = "salvage"): SalvageId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSalvageRecord(value: unknown): value is SalvageRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
