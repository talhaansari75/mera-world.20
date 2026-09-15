/** V6 platform module: security/input-limits. */

export type InputLimitsId = string;

export interface InputLimitsRecord {
  id: InputLimitsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createInputLimitsId(prefix = "input_limits"): InputLimitsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isInputLimitsRecord(value: unknown): value is InputLimitsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
