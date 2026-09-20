/** V7 domain module: economy/wallet. */
export type WalletId = string;
export interface WalletRecord { id: WalletId; createdAt: number; version: number }
export function createWallet(id: WalletId): WalletRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidWallet(value: unknown): value is WalletRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
