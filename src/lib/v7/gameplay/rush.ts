/** V7 domain module: gameplay/rush. */
export type RushId = string;
export interface RushRecord { id: RushId; createdAt: number; version: number }
export function createRush(id: RushId): RushRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRush(value: unknown): value is RushRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
