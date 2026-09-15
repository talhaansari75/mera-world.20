/** V6 platform module: content/categories. */

export type CategoriesId = string;

export interface CategoriesRecord {
  id: CategoriesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createCategoriesId(prefix = "categories"): CategoriesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCategoriesRecord(value: unknown): value is CategoriesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
