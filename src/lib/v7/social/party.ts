/** V7 domain module: social/party. */
export type PartyId = string;
export interface PartyRecord { id: PartyId; createdAt: number; version: number }
export function createParty(id: PartyId): PartyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidParty(value: unknown): value is PartyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
