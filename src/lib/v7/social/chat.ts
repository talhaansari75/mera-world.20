/** V7 domain module: social/chat. */
export type ChatId = string;
export interface ChatRecord { id: ChatId; createdAt: number; version: number }
export function createChat(id: ChatId): ChatRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidChat(value: unknown): value is ChatRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
