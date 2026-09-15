/** V7 domain module: notifications/quiet-hours. */
export type QuietHoursId = string;
export interface QuietHoursRecord { id: QuietHoursId; createdAt: number; version: number }
export function createQuietHours(id: QuietHoursId): QuietHoursRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidQuietHours(value: unknown): value is QuietHoursRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
