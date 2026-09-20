/** V6 platform module: economy/currencies. */

export type CurrenciesId = string;

export interface CurrenciesRecord {
  id: CurrenciesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createCurrenciesId(prefix = "currencies"): CurrenciesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCurrenciesRecord(value: unknown): value is CurrenciesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
