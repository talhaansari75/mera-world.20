/** V6 platform module: content/creator-review. */

export type CreatorReviewId = string;

export interface CreatorReviewRecord {
  id: CreatorReviewId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createCreatorReviewId(prefix = "creator_review"): CreatorReviewId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCreatorReviewRecord(value: unknown): value is CreatorReviewRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
