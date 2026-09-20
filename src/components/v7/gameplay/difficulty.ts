/** V7 domain module: gameplay/difficulty. */
export type DifficultyId = string;
export interface DifficultyRecord { id: DifficultyId; createdAt: number; version: number }
export function createDifficulty(id: DifficultyId): DifficultyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDifficulty(value: unknown): value is DifficultyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
