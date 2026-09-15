/** V7 domain module: security/password-policy. */
export type PasswordPolicyId = string;
export interface PasswordPolicyRecord { id: PasswordPolicyId; createdAt: number; version: number }
export function createPasswordPolicy(id: PasswordPolicyId): PasswordPolicyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPasswordPolicy(value: unknown): value is PasswordPolicyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
