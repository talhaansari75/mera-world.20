/** V7 domain module: content/categories. */
export type CategoriesId = string;
export interface CategoriesRecord { id: CategoriesId; createdAt: number; version: number }
export function createCategories(id: CategoriesId): CategoriesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCategories(value: unknown): value is CategoriesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
