/** V6 platform module: progression/levels. */

export type LevelsId = string;

export interface LevelsRecord {
  id: LevelsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createLevelsId(prefix = "levels"): LevelsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isLevelsRecord(value: unknown): value is LevelsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
