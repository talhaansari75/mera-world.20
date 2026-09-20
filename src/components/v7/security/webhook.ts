/** V7 domain module: security/webhook. */
export type WebhookId = string;
export interface WebhookRecord { id: WebhookId; createdAt: number; version: number }
export function createWebhook(id: WebhookId): WebhookRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidWebhook(value: unknown): value is WebhookRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
