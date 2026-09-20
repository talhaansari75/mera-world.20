/** V6 platform module: social/chat. */

export type ChatId = string;

export interface ChatRecord {
  id: ChatId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createChatId(prefix = "chat"): ChatId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isChatRecord(value: unknown): value is ChatRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
