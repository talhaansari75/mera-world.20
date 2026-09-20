/** V7 domain module: multiplayer/rating. */
export type RatingId = string;
export interface RatingRecord { id: RatingId; createdAt: number; version: number }
export function createRating(id: RatingId): RatingRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRating(value: unknown): value is RatingRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
