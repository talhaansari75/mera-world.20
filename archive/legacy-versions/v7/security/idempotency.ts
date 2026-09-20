/** V7 domain module: security/idempotency. */
export type IdempotencyId = string;
export interface IdempotencyRecord { id: IdempotencyId; createdAt: number; version: number }
export function createIdempotency(id: IdempotencyId): IdempotencyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidIdempotency(value: unknown): value is IdempotencyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
