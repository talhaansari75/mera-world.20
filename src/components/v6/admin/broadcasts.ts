/** V6 platform module: admin/broadcasts. */

export type BroadcastsId = string;

export interface BroadcastsRecord {
  id: BroadcastsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createBroadcastsId(prefix = "broadcasts"): BroadcastsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isBroadcastsRecord(value: unknown): value is BroadcastsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
