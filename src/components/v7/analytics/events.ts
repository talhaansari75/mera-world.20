/** V7 domain module: analytics/events. */
export type EventsId = string;
export interface EventsRecord { id: EventsId; createdAt: number; version: number }
export function createEvents(id: EventsId): EventsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidEvents(value: unknown): value is EventsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
