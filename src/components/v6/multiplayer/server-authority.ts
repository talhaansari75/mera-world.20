/** V6 platform module: multiplayer/server-authority. */

export type ServerAuthorityId = string;

export interface ServerAuthorityRecord {
  id: ServerAuthorityId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createServerAuthorityId(prefix = "server_authority"): ServerAuthorityId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isServerAuthorityRecord(value: unknown): value is ServerAuthorityRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
