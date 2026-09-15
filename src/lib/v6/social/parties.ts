/** V6 platform module: social/parties. */

export type PartiesId = string;

export interface PartiesRecord {
  id: PartiesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPartiesId(prefix = "parties"): PartiesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPartiesRecord(value: unknown): value is PartiesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
