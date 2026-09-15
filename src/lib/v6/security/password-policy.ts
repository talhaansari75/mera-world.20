/** V6 platform module: security/password-policy. */

export type PasswordPolicyId = string;

export interface PasswordPolicyRecord {
  id: PasswordPolicyId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPasswordPolicyId(prefix = "password_policy"): PasswordPolicyId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPasswordPolicyRecord(value: unknown): value is PasswordPolicyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
