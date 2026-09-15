export type NetworkQuality = 'offline' | 'poor' | 'good' | 'excellent';
export type QueueJob<T> = { id: string; run: () => Promise<T>; retries: number; maxRetries: number };

export class NetworkEngine {
  private queue: QueueJob<unknown>[] = [];
  private running = false;
  online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  quality: NetworkQuality = this.online ? 'good' : 'offline';

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => { this.online = true; this.quality = 'good'; void this.flush(); });
      window.addEventListener('offline', () => { this.online = false; this.quality = 'offline'; });
    }
  }

  enqueue<T>(job: Omit<QueueJob<T>, 'retries'>) {
    this.queue.push({ ...job, retries: 0 });
    void this.flush();
  }

  async request<T>(fn: () => Promise<T>, timeoutMs = 10000, retries = 3): Promise<T> {
    let last: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await Promise.race([
          fn(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), timeoutMs)),
        ]);
      } catch (error) {
        last = error;
        if (attempt < retries) await new Promise((r) => setTimeout(r, 250 * 2 ** attempt));
      }
    }
    throw last instanceof Error ? last : new Error('REQUEST_FAILED');
  }

  async flush() {
    if (this.running || !this.online) return;
    this.running = true;
    try {
      while (this.queue.length && this.online) {
        const job = this.queue[0];
        try { await job.run(); this.queue.shift(); }
        catch { job.retries++; if (job.retries > job.maxRetries) this.queue.shift(); else break; }
      }
    } finally { this.running = false; }
  }

  pendingCount() { return this.queue.length; }
}

export const networkEngine = new NetworkEngine();
