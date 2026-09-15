/** V7 domain module: progression/mastery. */
export type MasteryId = string;
export interface MasteryRecord { id: MasteryId; createdAt: number; version: number }
export function createMastery(id: MasteryId): MasteryRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidMastery(value: unknown): value is MasteryRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
