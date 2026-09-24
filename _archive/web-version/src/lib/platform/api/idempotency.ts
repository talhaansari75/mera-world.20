export class IdempotencyStore<T> {
  private readonly entries = new Map<string, { expiresAt: number; value: T }>();
  private readonly ttlMs: number;
  constructor(ttlMs = 86_400_000) { this.ttlMs = ttlMs; }
  get(key: string, now = Date.now()): T | undefined { const e = this.entries.get(key); if (!e || e.expiresAt <= now) { this.entries.delete(key); return undefined; } return e.value; }
  set(key: string, value: T, now = Date.now()): void { this.entries.set(key, { value, expiresAt: now + this.ttlMs }); }
  clear(): void { this.entries.clear(); }
}
