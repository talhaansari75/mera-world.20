/** V7 domain module: economy/shop. */
export type ShopId = string;
export interface ShopRecord { id: ShopId; createdAt: number; version: number }
export function createShop(id: ShopId): ShopRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidShop(value: unknown): value is ShopRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
