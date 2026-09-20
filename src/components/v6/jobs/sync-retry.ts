/** V6 platform module: jobs/sync-retry. */

export type SyncRetryId = string;

export interface SyncRetryRecord {
  id: SyncRetryId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSyncRetryId(prefix = "sync_retry"): SyncRetryId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSyncRetryRecord(value: unknown): value is SyncRetryRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
