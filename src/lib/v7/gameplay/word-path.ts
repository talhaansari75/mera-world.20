/** V7 domain module: gameplay/word-path. */
export type WordPathId = string;
export interface WordPathRecord { id: WordPathId; createdAt: number; version: number }
export function createWordPath(id: WordPathId): WordPathRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidWordPath(value: unknown): value is WordPathRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
