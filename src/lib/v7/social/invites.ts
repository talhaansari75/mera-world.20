/** V7 domain module: social/invites. */
export type InvitesId = string;
export interface InvitesRecord { id: InvitesId; createdAt: number; version: number }
export function createInvites(id: InvitesId): InvitesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidInvites(value: unknown): value is InvitesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
