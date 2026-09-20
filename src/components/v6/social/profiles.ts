/** V6 platform module: social/profiles. */

export type ProfilesId = string;

export interface ProfilesRecord {
  id: ProfilesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createProfilesId(prefix = "profiles"): ProfilesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isProfilesRecord(value: unknown): value is ProfilesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
