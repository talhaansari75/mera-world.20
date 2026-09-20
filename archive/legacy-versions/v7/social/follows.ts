/** V7 domain module: social/follows. */
export type FollowsId = string;
export interface FollowsRecord { id: FollowsId; createdAt: number; version: number }
export function createFollows(id: FollowsId): FollowsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidFollows(value: unknown): value is FollowsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
