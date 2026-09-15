/** V6 platform module: progression/prestige. */

export type PrestigeId = string;

export interface PrestigeRecord {
  id: PrestigeId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPrestigeId(prefix = "prestige"): PrestigeId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPrestigeRecord(value: unknown): value is PrestigeRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
