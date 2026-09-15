/** V7 domain module: multiplayer/turns. */
export type TurnsId = string;
export interface TurnsRecord { id: TurnsId; createdAt: number; version: number }
export function createTurns(id: TurnsId): TurnsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidTurns(value: unknown): value is TurnsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
