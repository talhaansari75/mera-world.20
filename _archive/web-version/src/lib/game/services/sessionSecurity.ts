import { FixedWindowRateLimiter } from '../../platform/security/rateLimit';
import { safeId } from '../../platform/security/input';
export const gameplayLimiter = new FixedWindowRateLimiter(240, 60_000);
export function validatePlayerAction(playerId: unknown, action: string): string { const id = safeId(playerId); if (!id || !action || action.length > 64) throw new Error('invalid_action'); if (!gameplayLimiter.allow(`${id}:${action}`)) throw new Error('rate_limited'); return id; }
