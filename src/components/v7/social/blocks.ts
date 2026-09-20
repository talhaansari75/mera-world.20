/** V7 domain module: social/blocks. */
export type BlocksId = string;
export interface BlocksRecord { id: BlocksId; createdAt: number; version: number }
export function createBlocks(id: BlocksId): BlocksRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidBlocks(value: unknown): value is BlocksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
