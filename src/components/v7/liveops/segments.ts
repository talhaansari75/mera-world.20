/** V7 domain module: liveops/segments. */
export type SegmentsId = string;
export interface SegmentsRecord { id: SegmentsId; createdAt: number; version: number }
export function createSegments(id: SegmentsId): SegmentsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidSegments(value: unknown): value is SegmentsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
