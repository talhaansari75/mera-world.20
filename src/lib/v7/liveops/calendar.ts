/** V7 domain module: liveops/calendar. */
export type CalendarId = string;
export interface CalendarRecord { id: CalendarId; createdAt: number; version: number }
export function createCalendar(id: CalendarId): CalendarRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCalendar(value: unknown): value is CalendarRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
