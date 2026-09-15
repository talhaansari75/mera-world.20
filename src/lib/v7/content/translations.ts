/** V7 domain module: content/translations. */
export type TranslationsId = string;
export interface TranslationsRecord { id: TranslationsId; createdAt: number; version: number }
export function createTranslations(id: TranslationsId): TranslationsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidTranslations(value: unknown): value is TranslationsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
