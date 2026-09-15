/** V7 domain module: admin/economy-adjustment. */
export type EconomyAdjustmentId = string;
export interface EconomyAdjustmentRecord { id: EconomyAdjustmentId; createdAt: number; version: number }
export function createEconomyAdjustment(id: EconomyAdjustmentId): EconomyAdjustmentRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidEconomyAdjustment(value: unknown): value is EconomyAdjustmentRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
