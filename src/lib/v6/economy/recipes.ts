/** V6 platform module: economy/recipes. */

export type RecipesId = string;

export interface RecipesRecord {
  id: RecipesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createRecipesId(prefix = "recipes"): RecipesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isRecipesRecord(value: unknown): value is RecipesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
