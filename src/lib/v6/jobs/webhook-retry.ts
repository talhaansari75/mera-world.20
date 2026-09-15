/** V6 platform module: jobs/webhook-retry. */

export type WebhookRetryId = string;

export interface WebhookRetryRecord {
  id: WebhookRetryId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createWebhookRetryId(prefix = "webhook_retry"): WebhookRetryId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isWebhookRetryRecord(value: unknown): value is WebhookRetryRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
