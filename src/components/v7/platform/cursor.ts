/** V7 domain module: platform/cursor. */
export type CursorId = string;
export interface CursorRecord { id: CursorId; createdAt: number; version: number }
export function createCursor(id: CursorId): CursorRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCursor(value: unknown): value is CursorRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
