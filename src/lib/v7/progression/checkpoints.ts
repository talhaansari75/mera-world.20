/** V7 domain module: progression/checkpoints. */
export type CheckpointsId = string;
export interface CheckpointsRecord { id: CheckpointsId; createdAt: number; version: number }
export function createCheckpoints(id: CheckpointsId): CheckpointsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCheckpoints(value: unknown): value is CheckpointsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
