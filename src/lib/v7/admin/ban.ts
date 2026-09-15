/** V7 domain module: admin/ban. */
export type BanId = string;
export interface BanRecord { id: BanId; createdAt: number; version: number }
export function createBan(id: BanId): BanRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidBan(value: unknown): value is BanRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
