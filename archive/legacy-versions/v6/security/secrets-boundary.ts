/** V6 platform module: security/secrets-boundary. */

export type SecretsBoundaryId = string;

export interface SecretsBoundaryRecord {
  id: SecretsBoundaryId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSecretsBoundaryId(prefix = "secrets_boundary"): SecretsBoundaryId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSecretsBoundaryRecord(value: unknown): value is SecretsBoundaryRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
