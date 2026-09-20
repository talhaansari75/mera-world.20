/** V6 platform module: security/sanitization. */

export type SanitizationId = string;

export interface SanitizationRecord {
  id: SanitizationId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSanitizationId(prefix = "sanitization"): SanitizationId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSanitizationRecord(value: unknown): value is SanitizationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
