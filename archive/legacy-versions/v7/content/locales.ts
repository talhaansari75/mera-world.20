/** V7 domain module: content/locales. */
export type LocalesId = string;
export interface LocalesRecord { id: LocalesId; createdAt: number; version: number }
export function createLocales(id: LocalesId): LocalesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidLocales(value: unknown): value is LocalesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
