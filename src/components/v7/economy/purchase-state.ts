/** V7 domain module: economy/purchase-state. */
export type PurchaseStateId = string;
export interface PurchaseStateRecord { id: PurchaseStateId; createdAt: number; version: number }
export function createPurchaseState(id: PurchaseStateId): PurchaseStateRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPurchaseState(value: unknown): value is PurchaseStateRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
