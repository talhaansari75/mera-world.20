/** V7 domain module: multiplayer/queues. */
export type QueuesId = string;
export interface QueuesRecord { id: QueuesId; createdAt: number; version: number }
export function createQueues(id: QueuesId): QueuesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidQueues(value: unknown): value is QueuesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
