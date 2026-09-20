/** V7 domain module: economy/tax. */
export type TaxId = string;
export interface TaxRecord { id: TaxId; createdAt: number; version: number }
export function createTax(id: TaxId): TaxRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidTax(value: unknown): value is TaxRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
