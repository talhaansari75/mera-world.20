/** V7 domain module: progression/ranks. */
export type RanksId = string;
export interface RanksRecord { id: RanksId; createdAt: number; version: number }
export function createRanks(id: RanksId): RanksRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRanks(value: unknown): value is RanksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
