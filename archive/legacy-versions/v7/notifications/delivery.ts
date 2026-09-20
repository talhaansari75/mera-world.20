/** V7 domain module: notifications/delivery. */
export type DeliveryId = string;
export interface DeliveryRecord { id: DeliveryId; createdAt: number; version: number }
export function createDelivery(id: DeliveryId): DeliveryRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDelivery(value: unknown): value is DeliveryRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
