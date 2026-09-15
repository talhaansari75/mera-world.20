/** V6 platform module: progression/seasons. */

export type SeasonsId = string;

export interface SeasonsRecord {
  id: SeasonsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSeasonsId(prefix = "seasons"): SeasonsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSeasonsRecord(value: unknown): value is SeasonsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
