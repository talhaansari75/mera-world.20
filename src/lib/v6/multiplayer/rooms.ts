/** V6 platform module: multiplayer/rooms. */

export type RoomsId = string;

export interface RoomsRecord {
  id: RoomsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createRoomsId(prefix = "rooms"): RoomsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isRoomsRecord(value: unknown): value is RoomsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
