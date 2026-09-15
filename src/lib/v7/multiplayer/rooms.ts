/** V7 domain module: multiplayer/rooms. */
export type RoomsId = string;
export interface RoomsRecord { id: RoomsId; createdAt: number; version: number }
export function createRooms(id: RoomsId): RoomsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRooms(value: unknown): value is RoomsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
