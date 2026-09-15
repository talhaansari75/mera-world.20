/** V6 platform module: security/sessions. */

export type SessionsId = string;

export interface SessionsRecord {
  id: SessionsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSessionsId(prefix = "sessions"): SessionsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSessionsRecord(value: unknown): value is SessionsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
