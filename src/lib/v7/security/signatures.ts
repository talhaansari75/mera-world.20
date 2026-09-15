/** V7 domain module: security/signatures. */
export type SignaturesId = string;
export interface SignaturesRecord { id: SignaturesId; createdAt: number; version: number }
export function createSignatures(id: SignaturesId): SignaturesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidSignatures(value: unknown): value is SignaturesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
