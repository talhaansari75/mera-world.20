/** V6 platform module: social/tournaments. */

export type TournamentsId = string;

export interface TournamentsRecord {
  id: TournamentsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createTournamentsId(prefix = "tournaments"): TournamentsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isTournamentsRecord(value: unknown): value is TournamentsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
