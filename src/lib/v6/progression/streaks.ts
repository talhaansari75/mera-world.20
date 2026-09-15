/** V6 platform module: progression/streaks. */

export type StreaksId = string;

export interface StreaksRecord {
  id: StreaksId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createStreaksId(prefix = "streaks"): StreaksId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isStreaksRecord(value: unknown): value is StreaksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
