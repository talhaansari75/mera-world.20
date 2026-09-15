/** V6 platform module: multiplayer/protocol. */

export type ProtocolId = string;

export interface ProtocolRecord {
  id: ProtocolId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createProtocolId(prefix = "protocol"): ProtocolId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isProtocolRecord(value: unknown): value is ProtocolRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
