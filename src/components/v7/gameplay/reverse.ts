/** V7 domain module: gameplay/reverse. */
export type ReverseId = string;
export interface ReverseRecord { id: ReverseId; createdAt: number; version: number }
export function createReverse(id: ReverseId): ReverseRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidReverse(value: unknown): value is ReverseRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
