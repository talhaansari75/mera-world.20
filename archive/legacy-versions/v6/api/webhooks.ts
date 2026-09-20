/** V6 platform module: api/webhooks. */

export type WebhooksId = string;

export interface WebhooksRecord {
  id: WebhooksId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createWebhooksId(prefix = "webhooks"): WebhooksId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isWebhooksRecord(value: unknown): value is WebhooksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
