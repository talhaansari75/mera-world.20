/** V7 domain module: personalization/language. */
export type LanguageId = string;
export interface LanguageRecord { id: LanguageId; createdAt: number; version: number }
export function createLanguage(id: LanguageId): LanguageRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidLanguage(value: unknown): value is LanguageRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
