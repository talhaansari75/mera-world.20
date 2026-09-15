/** V7 domain module: creator/ratings. */
export type RatingsId = string;
export interface RatingsRecord { id: RatingsId; createdAt: number; version: number }
export function createRatings(id: RatingsId): RatingsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRatings(value: unknown): value is RatingsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
