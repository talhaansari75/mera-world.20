/** V7 domain module: backend/reward-route. */
export type RewardRouteId = string;
export interface RewardRouteRecord { id: RewardRouteId; createdAt: number; version: number }
export function createRewardRoute(id: RewardRouteId): RewardRouteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRewardRoute(value: unknown): value is RewardRouteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
