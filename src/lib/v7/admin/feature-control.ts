/** V7 domain module: admin/feature-control. */
export type FeatureControlId = string;
export interface FeatureControlRecord { id: FeatureControlId; createdAt: number; version: number }
export function createFeatureControl(id: FeatureControlId): FeatureControlRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidFeatureControl(value: unknown): value is FeatureControlRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
