/** V6 platform module: progression/xp. */

export type XpId = string;

export interface XpRecord {
  id: XpId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createXpId(prefix = "xp"): XpId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isXpRecord(value: unknown): value is XpRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
