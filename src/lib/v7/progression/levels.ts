/** V7 domain module: progression/levels. */
export type LevelsId = string;
export interface LevelsRecord { id: LevelsId; createdAt: number; version: number }
export function createLevels(id: LevelsId): LevelsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidLevels(value: unknown): value is LevelsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
