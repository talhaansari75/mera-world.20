/** V6 platform module: multiplayer/room-state. */

export type RoomStateId = string;

export interface RoomStateRecord {
  id: RoomStateId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createRoomStateId(prefix = "room_state"): RoomStateId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isRoomStateRecord(value: unknown): value is RoomStateRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
