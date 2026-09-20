/** V6 platform module: progression/milestones. */

export type MilestonesId = string;

export interface MilestonesRecord {
  id: MilestonesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createMilestonesId(prefix = "milestones"): MilestonesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isMilestonesRecord(value: unknown): value is MilestonesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
