/** V7 domain module: liveops/news. */
export type NewsId = string;
export interface NewsRecord { id: NewsId; createdAt: number; version: number }
export function createNews(id: NewsId): NewsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidNews(value: unknown): value is NewsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
