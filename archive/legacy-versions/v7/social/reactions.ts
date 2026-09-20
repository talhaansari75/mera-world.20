/** V7 domain module: social/reactions. */
export type ReactionsId = string;
export interface ReactionsRecord { id: ReactionsId; createdAt: number; version: number }
export function createReactions(id: ReactionsId): ReactionsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidReactions(value: unknown): value is ReactionsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
