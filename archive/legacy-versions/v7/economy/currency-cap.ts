/** V7 domain module: economy/currency-cap. */
export type CurrencyCapId = string;
export interface CurrencyCapRecord { id: CurrencyCapId; createdAt: number; version: number }
export function createCurrencyCap(id: CurrencyCapId): CurrencyCapRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCurrencyCap(value: unknown): value is CurrencyCapRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
