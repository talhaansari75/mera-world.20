/** V6 platform module: api/responses. */

export type ResponsesId = string;

export interface ResponsesRecord {
  id: ResponsesId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createResponsesId(prefix = "responses"): ResponsesId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isResponsesRecord(value: unknown): value is ResponsesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
