/** V6 platform module: api/errors. */

export type ErrorsId = string;

export interface ErrorsRecord {
  id: ErrorsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createErrorsId(prefix = "errors"): ErrorsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isErrorsRecord(value: unknown): value is ErrorsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
