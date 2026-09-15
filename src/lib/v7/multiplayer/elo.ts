/** V7 domain module: multiplayer/elo. */
export type EloId = string;
export interface EloRecord { id: EloId; createdAt: number; version: number }
export function createElo(id: EloId): EloRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidElo(value: unknown): value is EloRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
