/** V7 domain module: multiplayer/reconnect. */
export type ReconnectId = string;
export interface ReconnectRecord { id: ReconnectId; createdAt: number; version: number }
export function createReconnect(id: ReconnectId): ReconnectRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidReconnect(value: unknown): value is ReconnectRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
