export type QueueItem<T> = { id: string; payload: T; attempts: number; createdAt: number; nextAttemptAt: number };

const STORAGE_PREFIX = "mwsj:offline-queue:";

export class OfflineQueue<T> {
  private items: QueueItem<T>[] = [];
  constructor(private readonly key = "default", private readonly maxItems = 250) { this.restore(); }
  private storageKey() { return `${STORAGE_PREFIX}${this.key}`; }
  private restore() { try { const raw = localStorage.getItem(this.storageKey()); if (raw) this.items = JSON.parse(raw) as QueueItem<T>[]; } catch { this.items = []; } }
  private persist() { try { localStorage.setItem(this.storageKey(), JSON.stringify(this.items)); } catch { /* offline storage is best effort */ } }
  enqueue(id: string, payload: T): void {
    if (!id || this.items.some(x => x.id === id)) return;
    this.items.push({ id, payload, attempts: 0, createdAt: Date.now(), nextAttemptAt: 0 });
    if (this.items.length > this.maxItems) this.items.splice(0, this.items.length - this.maxItems);
    this.persist();
  }
  async flush(send: (item: QueueItem<T>) => Promise<boolean>, now = Date.now()): Promise<number> {
    if (!navigator.onLine) return 0;
    let done = 0;
    for (const item of [...this.items]) {
      if (item.nextAttemptAt > now) continue;
      item.attempts++;
      try {
        if (await send(item)) { this.items = this.items.filter(x => x.id !== item.id); done++; }
        else item.nextAttemptAt = now + Math.min(60_000, 1_000 * 2 ** Math.min(item.attempts, 6));
      } catch { item.nextAttemptAt = now + Math.min(60_000, 1_000 * 2 ** Math.min(item.attempts, 6)); }
    }
    this.persist();
    return done;
  }
  size(): number { return this.items.length; }
  snapshot(): readonly QueueItem<T>[] { return this.items.map(x => ({ ...x })); }
  clear(): void { this.items = []; this.persist(); }
}
