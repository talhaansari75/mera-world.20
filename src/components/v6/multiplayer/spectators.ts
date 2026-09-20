/** V6 platform module: multiplayer/spectators. */

export type SpectatorsId = string;

export interface SpectatorsRecord {
  id: SpectatorsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSpectatorsId(prefix = "spectators"): SpectatorsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSpectatorsRecord(value: unknown): value is SpectatorsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
