/** V7 domain module: gameplay/hints. */
export type HintsId = string;
export interface HintsRecord { id: HintsId; createdAt: number; version: number }
export function createHints(id: HintsId): HintsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidHints(value: unknown): value is HintsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
