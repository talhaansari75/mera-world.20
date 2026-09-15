/** V6 platform module: platform/consent. */

export type ConsentId = string;

export interface ConsentRecord {
  id: ConsentId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createConsentId(prefix = "consent"): ConsentId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
