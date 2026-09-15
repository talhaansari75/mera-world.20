/** V7 domain module: admin/users. */
export type UsersId = string;
export interface UsersRecord { id: UsersId; createdAt: number; version: number }
export function createUsers(id: UsersId): UsersRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidUsers(value: unknown): value is UsersRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
