/** V7 domain module: platform/api-response. */
export type ApiResponseId = string;
export interface ApiResponseRecord { id: ApiResponseId; createdAt: number; version: number }
export function createApiResponse(id: ApiResponseId): ApiResponseRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidApiResponse(value: unknown): value is ApiResponseRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
