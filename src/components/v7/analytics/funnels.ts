/** V7 domain module: analytics/funnels. */
export type FunnelsId = string;
export interface FunnelsRecord { id: FunnelsId; createdAt: number; version: number }
export function createFunnels(id: FunnelsId): FunnelsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidFunnels(value: unknown): value is FunnelsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
