/** V6 platform module: security/origin-check. */

export type OriginCheckId = string;

export interface OriginCheckRecord {
  id: OriginCheckId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createOriginCheckId(prefix = "origin_check"): OriginCheckId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isOriginCheckRecord(value: unknown): value is OriginCheckRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
