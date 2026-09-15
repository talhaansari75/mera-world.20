/** V6 platform module: jobs/season-rollover. */

export type SeasonRolloverId = string;

export interface SeasonRolloverRecord {
  id: SeasonRolloverId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSeasonRolloverId(prefix = "season_rollover"): SeasonRolloverId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSeasonRolloverRecord(value: unknown): value is SeasonRolloverRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
