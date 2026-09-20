/** V6 platform module: social/presence. */

export type PresenceId = string;

export interface PresenceRecord {
  id: PresenceId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPresenceId(prefix = "presence"): PresenceId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPresenceRecord(value: unknown): value is PresenceRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
