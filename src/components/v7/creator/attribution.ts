/** V7 domain module: creator/attribution. */
export type AttributionId = string;
export interface AttributionRecord { id: AttributionId; createdAt: number; version: number }
export function createAttribution(id: AttributionId): AttributionRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAttribution(value: unknown): value is AttributionRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
