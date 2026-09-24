export type RateLimitState = { count: number; resetAt: number };
export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, RateLimitState>();
  private readonly limit: number;
  private readonly windowMs: number;
  constructor(limit: number, windowMs: number) { this.limit = limit; this.windowMs = windowMs; }
  allow(key: string, now = Date.now()): boolean {
    const current = this.buckets.get(key);
    if (!current || now >= current.resetAt) { this.buckets.set(key, { count: 1, resetAt: now + this.windowMs }); return true; }
    if (current.count >= this.limit) return false;
    current.count += 1; return true;
  }
  retryAfter(key: string, now = Date.now()): number { return Math.max(0, (this.buckets.get(key)?.resetAt ?? now) - now); }
}
