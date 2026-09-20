/** V6 platform module: content/words. */

export type WordsId = string;

export interface WordsRecord {
  id: WordsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createWordsId(prefix = "words"): WordsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isWordsRecord(value: unknown): value is WordsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
