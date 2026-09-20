/** V6 platform module: jobs/analytics-rollup. */

export type AnalyticsRollupId = string;

export interface AnalyticsRollupRecord {
  id: AnalyticsRollupId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createAnalyticsRollupId(prefix = "analytics_rollup"): AnalyticsRollupId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isAnalyticsRollupRecord(value: unknown): value is AnalyticsRollupRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
