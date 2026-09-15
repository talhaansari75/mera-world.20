/** V6 platform module: progression/achievements. */

export type AchievementsId = string;

export interface AchievementsRecord {
  id: AchievementsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createAchievementsId(prefix = "achievements"): AchievementsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isAchievementsRecord(value: unknown): value is AchievementsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
