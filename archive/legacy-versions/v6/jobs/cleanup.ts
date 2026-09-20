/** V6 platform module: jobs/cleanup. */

export type CleanupId = string;

export interface CleanupRecord {
  id: CleanupId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createCleanupId(prefix = "cleanup"): CleanupId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCleanupRecord(value: unknown): value is CleanupRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
