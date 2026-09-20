/** V6 platform module: platform/offline. */

export type OfflineId = string;

export interface OfflineRecord {
  id: OfflineId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createOfflineId(prefix = "offline"): OfflineId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isOfflineRecord(value: unknown): value is OfflineRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
