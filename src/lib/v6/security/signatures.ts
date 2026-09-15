/** V6 platform module: security/signatures. */

export type SignaturesId = string;

export interface SignaturesRecord {
  id: SignaturesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSignaturesId(prefix = "signatures"): SignaturesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSignaturesRecord(value: unknown): value is SignaturesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
