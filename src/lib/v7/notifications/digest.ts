/** V7 domain module: notifications/digest. */
export type DigestId = string;
export interface DigestRecord { id: DigestId; createdAt: number; version: number }
export function createDigest(id: DigestId): DigestRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDigest(value: unknown): value is DigestRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
