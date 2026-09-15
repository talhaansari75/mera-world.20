/** V6 platform module: social/gifts. */

export type GiftsId = string;

export interface GiftsRecord {
  id: GiftsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createGiftsId(prefix = "gifts"): GiftsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isGiftsRecord(value: unknown): value is GiftsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
