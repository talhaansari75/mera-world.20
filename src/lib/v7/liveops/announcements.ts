/** V7 domain module: liveops/announcements. */
export type AnnouncementsId = string;
export interface AnnouncementsRecord { id: AnnouncementsId; createdAt: number; version: number }
export function createAnnouncements(id: AnnouncementsId): AnnouncementsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAnnouncements(value: unknown): value is AnnouncementsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
