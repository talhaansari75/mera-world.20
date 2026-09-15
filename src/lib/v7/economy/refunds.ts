/** V7 domain module: economy/refunds. */
export type RefundsId = string;
export interface RefundsRecord { id: RefundsId; createdAt: number; version: number }
export function createRefunds(id: RefundsId): RefundsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRefunds(value: unknown): value is RefundsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
