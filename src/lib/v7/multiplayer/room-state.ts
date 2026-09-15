/** V7 domain module: multiplayer/room-state. */
export type RoomStateId = string;
export interface RoomStateRecord { id: RoomStateId; createdAt: number; version: number }
export function createRoomState(id: RoomStateId): RoomStateRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRoomState(value: unknown): value is RoomStateRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
