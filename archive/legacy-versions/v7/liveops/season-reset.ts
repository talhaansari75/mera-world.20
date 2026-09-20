/** V7 domain module: liveops/season-reset. */
export type SeasonResetId = string;
export interface SeasonResetRecord { id: SeasonResetId; createdAt: number; version: number }
export function createSeasonReset(id: SeasonResetId): SeasonResetRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidSeasonReset(value: unknown): value is SeasonResetRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
