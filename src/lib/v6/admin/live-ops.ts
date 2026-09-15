/** V6 platform module: admin/live-ops. */

export type LiveOpsId = string;

export interface LiveOpsRecord {
  id: LiveOpsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createLiveOpsId(prefix = "live_ops"): LiveOpsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isLiveOpsRecord(value: unknown): value is LiveOpsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
