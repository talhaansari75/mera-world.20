/** V7 domain module: liveops/inbox. */
export type InboxId = string;
export interface InboxRecord { id: InboxId; createdAt: number; version: number }
export function createInbox(id: InboxId): InboxRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidInbox(value: unknown): value is InboxRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
