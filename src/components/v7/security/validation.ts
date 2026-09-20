/** V7 domain module: security/validation. */
export type ValidationId = string;
export interface ValidationRecord { id: ValidationId; createdAt: number; version: number }
export function createValidation(id: ValidationId): ValidationRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidValidation(value: unknown): value is ValidationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
