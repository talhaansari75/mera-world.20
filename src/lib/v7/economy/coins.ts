/** V7 domain module: economy/coins. */
export type CoinsId = string;
export interface CoinsRecord { id: CoinsId; createdAt: number; version: number }
export function createCoins(id: CoinsId): CoinsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCoins(value: unknown): value is CoinsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
