/** V7 domain module: social/clan-members. */
export type ClanMembersId = string;
export interface ClanMembersRecord { id: ClanMembersId; createdAt: number; version: number }
export function createClanMembers(id: ClanMembersId): ClanMembersRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidClanMembers(value: unknown): value is ClanMembersRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
