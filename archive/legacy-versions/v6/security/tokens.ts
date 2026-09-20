/** V6 platform module: security/tokens. */

export type TokensId = string;

export interface TokensRecord {
  id: TokensId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createTokensId(prefix = "tokens"): TokensId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isTokensRecord(value: unknown): value is TokensRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
