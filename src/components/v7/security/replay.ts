/** V7 domain module: security/replay. */
export type ReplayId = string;
export interface ReplayRecord { id: ReplayId; createdAt: number; version: number }
export function createReplay(id: ReplayId): ReplayRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidReplay(value: unknown): value is ReplayRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
