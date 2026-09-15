/** V7 domain module: progression/milestones. */
export type MilestonesId = string;
export interface MilestonesRecord { id: MilestonesId; createdAt: number; version: number }
export function createMilestones(id: MilestonesId): MilestonesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidMilestones(value: unknown): value is MilestonesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
