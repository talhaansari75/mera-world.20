/** V6 platform module: social/blocks. */

export type BlocksId = string;

export interface BlocksRecord {
  id: BlocksId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createBlocksId(prefix = "blocks"): BlocksId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isBlocksRecord(value: unknown): value is BlocksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
