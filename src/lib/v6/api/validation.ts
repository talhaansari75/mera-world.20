/** V6 platform module: api/validation. */

export type ValidationId = string;

export interface ValidationRecord {
  id: ValidationId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createValidationId(prefix = "validation"): ValidationId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isValidationRecord(value: unknown): value is ValidationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
