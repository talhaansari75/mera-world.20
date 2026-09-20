/** V6 platform module: economy/shop-rotation. */

export type ShopRotationId = string;

export interface ShopRotationRecord {
  id: ShopRotationId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createShopRotationId(prefix = "shop_rotation"): ShopRotationId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isShopRotationRecord(value: unknown): value is ShopRotationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
