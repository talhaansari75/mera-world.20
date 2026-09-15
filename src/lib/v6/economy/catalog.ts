/** V6 platform module: economy/catalog. */

export type CatalogId = string;

export interface CatalogRecord {
  id: CatalogId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createCatalogId(prefix = "catalog"): CatalogId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCatalogRecord(value: unknown): value is CatalogRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
