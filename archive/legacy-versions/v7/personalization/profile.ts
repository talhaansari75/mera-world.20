/** V7 domain module: personalization/profile. */
export type ProfileId = string;
export interface ProfileRecord { id: ProfileId; createdAt: number; version: number }
export function createProfile(id: ProfileId): ProfileRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidProfile(value: unknown): value is ProfileRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
