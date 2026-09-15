/** V6 platform module: api/versioning. */

export type VersioningId = string;

export interface VersioningRecord {
  id: VersioningId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createVersioningId(prefix = "versioning"): VersioningId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isVersioningRecord(value: unknown): value is VersioningRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
