/** V6 platform module: jobs/shop-refresh. */

export type ShopRefreshId = string;

export interface ShopRefreshRecord {
  id: ShopRefreshId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createShopRefreshId(prefix = "shop_refresh"): ShopRefreshId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isShopRefreshRecord(value: unknown): value is ShopRefreshRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
