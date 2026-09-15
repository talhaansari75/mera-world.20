/** V7 domain module: platform/api-error. */
export type ApiErrorId = string;
export interface ApiErrorRecord { id: ApiErrorId; createdAt: number; version: number }
export function createApiError(id: ApiErrorId): ApiErrorRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidApiError(value: unknown): value is ApiErrorRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
