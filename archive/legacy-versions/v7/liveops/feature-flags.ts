/** V7 domain module: liveops/feature-flags. */
export type FeatureFlagsId = string;
export interface FeatureFlagsRecord { id: FeatureFlagsId; createdAt: number; version: number }
export function createFeatureFlags(id: FeatureFlagsId): FeatureFlagsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidFeatureFlags(value: unknown): value is FeatureFlagsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
