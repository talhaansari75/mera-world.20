/** V6 platform module: multiplayer/events. */

export type EventsId = string;

export interface EventsRecord {
  id: EventsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createEventsId(prefix = "events"): EventsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isEventsRecord(value: unknown): value is EventsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
