/** V6 platform module: content/daily-packs. */

export type DailyPacksId = string;

export interface DailyPacksRecord {
  id: DailyPacksId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createDailyPacksId(prefix = "daily_packs"): DailyPacksId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isDailyPacksRecord(value: unknown): value is DailyPacksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
