/** V7 domain module: backend/quest-route. */
export type QuestRouteId = string;
export interface QuestRouteRecord { id: QuestRouteId; createdAt: number; version: number }
export function createQuestRoute(id: QuestRouteId): QuestRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidQuestRoute(value: unknown): value is QuestRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
