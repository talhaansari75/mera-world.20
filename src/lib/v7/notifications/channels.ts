/** V7 domain module: notifications/channels. */
export type ChannelsId = string;
export interface ChannelsRecord { id: ChannelsId; createdAt: number; version: number }
export function createChannels(id: ChannelsId): ChannelsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidChannels(value: unknown): value is ChannelsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
