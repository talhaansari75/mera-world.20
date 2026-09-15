/** V7 domain module: economy/offers. */
export type OffersId = string;
export interface OffersRecord { id: OffersId; createdAt: number; version: number }
export function createOffers(id: OffersId): OffersRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidOffers(value: unknown): value is OffersRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
