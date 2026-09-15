/** V7 domain module: progression/badges. */
export type BadgesId = string;
export interface BadgesRecord { id: BadgesId; createdAt: number; version: number }
export function createBadges(id: BadgesId): BadgesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidBadges(value: unknown): value is BadgesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
