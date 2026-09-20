/** V6 platform module: content/translations. */

export type TranslationsId = string;

export interface TranslationsRecord {
  id: TranslationsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createTranslationsId(prefix = "translations"): TranslationsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isTranslationsRecord(value: unknown): value is TranslationsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
