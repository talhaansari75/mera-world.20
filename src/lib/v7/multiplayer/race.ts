/** V7 domain module: multiplayer/race. */
export type RaceId = string;
export interface RaceRecord { id: RaceId; createdAt: number; version: number }
export function createRace(id: RaceId): RaceRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRace(value: unknown): value is RaceRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
