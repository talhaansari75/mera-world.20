/** V6 platform module: economy/wallet. */

export type WalletId = string;

export interface WalletRecord {
  id: WalletId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createWalletId(prefix = "wallet"): WalletId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isWalletRecord(value: unknown): value is WalletRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
