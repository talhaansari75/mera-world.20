/** V7 domain module: backend/shop-route. */
export type ShopRouteId = string;
export interface ShopRouteRecord { id: ShopRouteId; createdAt: number; version: number }
export function createShopRoute(id: ShopRouteId): ShopRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidShopRoute(value: unknown): value is ShopRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
