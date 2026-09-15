/** V6 platform module: economy/purchase-validation. */

export type PurchaseValidationId = string;

export interface PurchaseValidationRecord {
  id: PurchaseValidationId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPurchaseValidationId(prefix = "purchase_validation"): PurchaseValidationId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPurchaseValidationRecord(value: unknown): value is PurchaseValidationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
