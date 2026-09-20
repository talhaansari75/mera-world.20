/** V7 domain module: gameplay/boss. */
export type BossId = string;
export interface BossRecord { id: BossId; createdAt: number; version: number }
export function createBoss(id: BossId): BossRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidBoss(value: unknown): value is BossRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
