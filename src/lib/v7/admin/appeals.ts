/** V7 domain module: admin/appeals. */
export type AppealsId = string;
export interface AppealsRecord { id: AppealsId; createdAt: number; version: number }
export function createAppeals(id: AppealsId): AppealsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAppeals(value: unknown): value is AppealsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
