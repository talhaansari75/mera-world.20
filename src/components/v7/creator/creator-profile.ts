/** V7 domain module: creator/creator-profile. */
export type CreatorProfileId = string;
export interface CreatorProfileRecord { id: CreatorProfileId; createdAt: number; version: number }
export function createCreatorProfile(id: CreatorProfileId): CreatorProfileRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCreatorProfile(value: unknown): value is CreatorProfileRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
