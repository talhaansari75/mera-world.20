/** V7 domain module: economy/discounts. */
export type DiscountsId = string;
export interface DiscountsRecord { id: DiscountsId; createdAt: number; version: number }
export function createDiscounts(id: DiscountsId): DiscountsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDiscounts(value: unknown): value is DiscountsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
