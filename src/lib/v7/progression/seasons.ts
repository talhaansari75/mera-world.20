/** V7 domain module: progression/seasons. */
export type SeasonsId = string;
export interface SeasonsRecord { id: SeasonsId; createdAt: number; version: number }
export function createSeasons(id: SeasonsId): SeasonsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidSeasons(value: unknown): value is SeasonsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
