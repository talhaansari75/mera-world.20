/** V7 domain module: multiplayer/latency. */
export type LatencyId = string;
export interface LatencyRecord { id: LatencyId; createdAt: number; version: number }
export function createLatency(id: LatencyId): LatencyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidLatency(value: unknown): value is LatencyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
