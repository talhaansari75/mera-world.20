/** V7 domain module: content/pronunciation. */
export type PronunciationId = string;
export interface PronunciationRecord { id: PronunciationId; createdAt: number; version: number }
export function createPronunciation(id: PronunciationId): PronunciationRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPronunciation(value: unknown): value is PronunciationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
