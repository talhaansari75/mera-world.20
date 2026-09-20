/** V6 platform module: multiplayer/rewards. */

export type RewardsId = string;

export interface RewardsRecord {
  id: RewardsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createRewardsId(prefix = "rewards"): RewardsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isRewardsRecord(value: unknown): value is RewardsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
