/** V7 domain module: security/tokens. */
export type TokensId = string;
export interface TokensRecord { id: TokensId; createdAt: number; version: number }
export function createTokens(id: TokensId): TokensRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidTokens(value: unknown): value is TokensRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
