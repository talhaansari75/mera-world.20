/** V7 domain module: platform/pagination. */
export type PaginationId = string;
export interface PaginationRecord { id: PaginationId; createdAt: number; version: number }
export function createPagination(id: PaginationId): PaginationRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPagination(value: unknown): value is PaginationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
