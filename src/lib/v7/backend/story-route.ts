/** V7 domain module: backend/story-route. */
export type StoryRouteId = string;
export interface StoryRouteRecord { id: StoryRouteId; createdAt: number; version: number }
export function createStoryRoute(id: StoryRouteId): StoryRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidStoryRoute(value: unknown): value is StoryRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
