/** V6 platform module: content/validators. */

export type ValidatorsId = string;

export interface ValidatorsRecord {
  id: ValidatorsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createValidatorsId(prefix = "validators"): ValidatorsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isValidatorsRecord(value: unknown): value is ValidatorsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
