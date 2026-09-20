/** V7 domain module: analytics/economy. */
export type EconomyId = string;
export interface EconomyRecord { id: EconomyId; createdAt: number; version: number }
export function createEconomy(id: EconomyId): EconomyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidEconomy(value: unknown): value is EconomyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
