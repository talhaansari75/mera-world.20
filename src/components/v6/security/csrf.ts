/** V6 platform module: security/csrf. */

export type CsrfId = string;

export interface CsrfRecord {
  id: CsrfId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createCsrfId(prefix = "csrf"): CsrfId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCsrfRecord(value: unknown): value is CsrfRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
