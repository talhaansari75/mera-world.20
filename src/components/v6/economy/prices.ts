/** V6 platform module: economy/prices. */

export type PricesId = string;

export interface PricesRecord {
  id: PricesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPricesId(prefix = "prices"): PricesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPricesRecord(value: unknown): value is PricesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
