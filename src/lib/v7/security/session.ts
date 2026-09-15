/** V7 domain module: security/session. */
export type SessionId = string;
export interface SessionRecord { id: SessionId; createdAt: number; version: number }
export function createSession(id: SessionId): SessionRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidSession(value: unknown): value is SessionRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
