/** V6 platform module: api/pagination. */

export type PaginationId = string;

export interface PaginationRecord {
  id: PaginationId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPaginationId(prefix = "pagination"): PaginationId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPaginationRecord(value: unknown): value is PaginationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
