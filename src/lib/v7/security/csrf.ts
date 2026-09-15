/** V7 domain module: security/csrf. */
export type CsrfId = string;
export interface CsrfRecord { id: CsrfId; createdAt: number; version: number }
export function createCsrf(id: CsrfId): CsrfRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCsrf(value: unknown): value is CsrfRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
