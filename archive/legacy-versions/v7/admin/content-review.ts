/** V7 domain module: admin/content-review. */
export type ContentReviewId = string;
export interface ContentReviewRecord { id: ContentReviewId; createdAt: number; version: number }
export function createContentReview(id: ContentReviewId): ContentReviewRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidContentReview(value: unknown): value is ContentReviewRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
