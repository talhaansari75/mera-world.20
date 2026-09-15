/** V7 domain module: notifications/email. */
export type EmailId = string;
export interface EmailRecord { id: EmailId; createdAt: number; version: number }
export function createEmail(id: EmailId): EmailRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidEmail(value: unknown): value is EmailRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
