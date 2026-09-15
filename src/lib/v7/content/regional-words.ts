/** V7 domain module: content/regional-words. */
export type RegionalWordsId = string;
export interface RegionalWordsRecord { id: RegionalWordsId; createdAt: number; version: number }
export function createRegionalWords(id: RegionalWordsId): RegionalWordsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRegionalWords(value: unknown): value is RegionalWordsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
