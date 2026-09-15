/** V7 domain module: analytics/progression. */
export type ProgressionId = string;
export interface ProgressionRecord { id: ProgressionId; createdAt: number; version: number }
export function createProgression(id: ProgressionId): ProgressionRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidProgression(value: unknown): value is ProgressionRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
