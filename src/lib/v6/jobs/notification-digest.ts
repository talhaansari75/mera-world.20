/** V6 platform module: jobs/notification-digest. */

export type NotificationDigestId = string;

export interface NotificationDigestRecord {
  id: NotificationDigestId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createNotificationDigestId(prefix = "notification_digest"): NotificationDigestId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isNotificationDigestRecord(value: unknown): value is NotificationDigestRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
