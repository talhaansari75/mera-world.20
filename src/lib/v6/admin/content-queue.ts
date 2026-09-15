/** V6 platform module: admin/content-queue. */

export type ContentQueueId = string;

export interface ContentQueueRecord {
  id: ContentQueueId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createContentQueueId(prefix = "content_queue"): ContentQueueId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isContentQueueRecord(value: unknown): value is ContentQueueRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
