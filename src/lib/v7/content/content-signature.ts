/** V7 domain module: content/content-signature. */
export type ContentSignatureId = string;
export interface ContentSignatureRecord { id: ContentSignatureId; createdAt: number; version: number }
export function createContentSignature(id: ContentSignatureId): ContentSignatureRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidContentSignature(value: unknown): value is ContentSignatureRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
