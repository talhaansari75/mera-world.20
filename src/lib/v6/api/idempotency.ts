/** V6 platform module: api/idempotency. */

export type IdempotencyId = string;

export interface IdempotencyRecord {
  id: IdempotencyId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createIdempotencyId(prefix = "idempotency"): IdempotencyId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isIdempotencyRecord(value: unknown): value is IdempotencyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
