/** V7 domain module: personalization/goals. */
export type GoalsId = string;
export interface GoalsRecord { id: GoalsId; createdAt: number; version: number }
export function createGoals(id: GoalsId): GoalsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidGoals(value: unknown): value is GoalsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
