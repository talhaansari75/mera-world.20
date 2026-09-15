/** V7 domain module: social/presence. */
export type PresenceId = string;
export interface PresenceRecord { id: PresenceId; createdAt: number; version: number }
export function createPresence(id: PresenceId): PresenceRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPresence(value: unknown): value is PresenceRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
