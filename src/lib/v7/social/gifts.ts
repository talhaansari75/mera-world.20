/** V7 domain module: social/gifts. */
export type GiftsId = string;
export interface GiftsRecord { id: GiftsId; createdAt: number; version: number }
export function createGifts(id: GiftsId): GiftsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidGifts(value: unknown): value is GiftsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
