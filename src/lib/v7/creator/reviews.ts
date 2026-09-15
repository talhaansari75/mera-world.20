/** V7 domain module: creator/reviews. */
export type ReviewsId = string;
export interface ReviewsRecord { id: ReviewsId; createdAt: number; version: number }
export function createReviews(id: ReviewsId): ReviewsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidReviews(value: unknown): value is ReviewsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
