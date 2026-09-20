/** V6 platform module: security/account-lock. */

export type AccountLockId = string;

export interface AccountLockRecord {
  id: AccountLockId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createAccountLockId(prefix = "account_lock"): AccountLockId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isAccountLockRecord(value: unknown): value is AccountLockRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
