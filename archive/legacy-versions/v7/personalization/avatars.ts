/** V7 domain module: personalization/avatars. */
export type AvatarsId = string;
export interface AvatarsRecord { id: AvatarsId; createdAt: number; version: number }
export function createAvatars(id: AvatarsId): AvatarsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAvatars(value: unknown): value is AvatarsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
