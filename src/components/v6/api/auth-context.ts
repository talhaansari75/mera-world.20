/** V6 platform module: api/auth-context. */

export type AuthContextId = string;

export interface AuthContextRecord {
  id: AuthContextId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createAuthContextId(prefix = "auth_context"): AuthContextId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isAuthContextRecord(value: unknown): value is AuthContextRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
