/** V7 domain module: security/nonce. */
export type NonceId = string;
export interface NonceRecord { id: NonceId; createdAt: number; version: number }
export function createNonce(id: NonceId): NonceRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidNonce(value: unknown): value is NonceRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
