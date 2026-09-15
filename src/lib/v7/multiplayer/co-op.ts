/** V7 domain module: multiplayer/co-op. */
export type CoOpId = string;
export interface CoOpRecord { id: CoOpId; createdAt: number; version: number }
export function createCoOp(id: CoOpId): CoOpRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCoOp(value: unknown): value is CoOpRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
