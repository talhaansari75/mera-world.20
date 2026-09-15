/** V7 domain module: economy/pricing. */
export type PricingId = string;
export interface PricingRecord { id: PricingId; createdAt: number; version: number }
export function createPricing(id: PricingId): PricingRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPricing(value: unknown): value is PricingRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
