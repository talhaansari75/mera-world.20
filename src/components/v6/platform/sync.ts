/** V6 platform module: platform/sync. */

export type SyncId = string;

export interface SyncRecord {
  id: SyncId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSyncId(prefix = "sync"): SyncId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSyncRecord(value: unknown): value is SyncRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
