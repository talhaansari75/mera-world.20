/** V7 domain module: personalization/bookmarks. */
export type BookmarksId = string;
export interface BookmarksRecord { id: BookmarksId; createdAt: number; version: number }
export function createBookmarks(id: BookmarksId): BookmarksRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidBookmarks(value: unknown): value is BookmarksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
