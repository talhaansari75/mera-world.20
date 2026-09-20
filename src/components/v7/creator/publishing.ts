/** V7 domain module: creator/publishing. */
export type PublishingId = string;
export interface PublishingRecord { id: PublishingId; createdAt: number; version: number }
export function createPublishing(id: PublishingId): PublishingRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPublishing(value: unknown): value is PublishingRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
