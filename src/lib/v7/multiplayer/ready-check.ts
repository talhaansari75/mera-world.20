/** V7 domain module: multiplayer/ready-check. */
export type ReadyCheckId = string;
export interface ReadyCheckRecord { id: ReadyCheckId; createdAt: number; version: number }
export function createReadyCheck(id: ReadyCheckId): ReadyCheckRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidReadyCheck(value: unknown): value is ReadyCheckRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
