/** V7 domain module: content/word-list. */
export type WordListId = string;
export interface WordListRecord { id: WordListId; createdAt: number; version: number }
export function createWordList(id: WordListId): WordListRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidWordList(value: unknown): value is WordListRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
