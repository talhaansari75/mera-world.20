/** V6 platform module: api/request-id. */

export type RequestIdId = string;

export interface RequestIdRecord {
  id: RequestIdId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createRequestIdId(prefix = "request_id"): RequestIdId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isRequestIdRecord(value: unknown): value is RequestIdRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
