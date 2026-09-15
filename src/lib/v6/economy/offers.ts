/** V6 platform module: economy/offers. */

export type OffersId = string;

export interface OffersRecord {
  id: OffersId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createOffersId(prefix = "offers"): OffersId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isOffersRecord(value: unknown): value is OffersRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
