/** V7 domain module: multiplayer/versus. */
export type VersusId = string;
export interface VersusRecord { id: VersusId; createdAt: number; version: number }
export function createVersus(id: VersusId): VersusRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidVersus(value: unknown): value is VersusRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
