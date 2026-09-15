/** V7 domain module: analytics/sessions. */
export type SessionsId = string;
export interface SessionsRecord { id: SessionsId; createdAt: number; version: number }
export function createSessions(id: SessionsId): SessionsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidSessions(value: unknown): value is SessionsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
