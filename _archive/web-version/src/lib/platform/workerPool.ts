export type WorkerTask<T> = () => Promise<T>;
export class WorkerPool {
  constructor(private concurrency = Math.max(1, Math.min(4, typeof navigator !== 'undefined' ? navigator.hardwareConcurrency ?? 2 : 2))) {}
  async runAll<T>(tasks: WorkerTask<T>[]) {
    const results: T[] = new Array(tasks.length);
    let next = 0;
    const worker = async () => { while (true) { const i = next++; if (i >= tasks.length) return; results[i] = await tasks[i](); } };
    await Promise.all(Array.from({ length: Math.min(this.concurrency, tasks.length) }, worker));
    return results;
  }
}
