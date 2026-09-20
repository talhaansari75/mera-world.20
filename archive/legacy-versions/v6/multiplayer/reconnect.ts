/** V6 platform module: multiplayer/reconnect. */

export type ReconnectId = string;

export interface ReconnectRecord {
  id: ReconnectId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createReconnectId(prefix = "reconnect"): ReconnectId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isReconnectRecord(value: unknown): value is ReconnectRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
