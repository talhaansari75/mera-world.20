export type RequestOptions = RequestInit & { timeoutMs?: number; retries?: number };
export async function requestWithTimeout(input: RequestInfo | URL, options: RequestOptions = {}): Promise<Response> {
  const { timeoutMs = 10_000, retries = 1, signal, ...init } = options;
  let last: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const relay = () => controller.abort();
    signal?.addEventListener('abort', relay, { once: true });
    try { return await fetch(input, { ...init, signal: controller.signal }); }
    catch (error) { last = error; if (attempt === retries) throw error; await new Promise(r => setTimeout(r, 250 * 2 ** attempt)); }
    finally { clearTimeout(timer); signal?.removeEventListener('abort', relay); }
  }
  throw last;
}
