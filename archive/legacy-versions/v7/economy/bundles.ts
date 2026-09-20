/** V7 domain module: economy/bundles. */
export type BundlesId = string;
export interface BundlesRecord { id: BundlesId; createdAt: number; version: number }
export function createBundles(id: BundlesId): BundlesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidBundles(value: unknown): value is BundlesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
