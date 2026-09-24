export type AIProvider = { id: string; endpoint: string; enabled: boolean; priority: number };
export type GenerationRequest = { kind: 'level' | 'hint' | 'story' | 'daily' | 'words'; prompt: string; budgetTokens: number };

export class AIProviderRouter {
  constructor(private providers: AIProvider[]) {}
  async generate(req: GenerationRequest, fetcher = fetch): Promise<unknown> {
    const candidates = this.providers.filter((p) => p.enabled).sort((a, b) => a.priority - b.priority);
    let last: unknown;
    for (const provider of candidates) {
      try {
        const res = await fetcher(provider.endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(req) });
        if (!res.ok) throw new Error(`AI_${res.status}`);
        return await res.json();
      } catch (e) { last = e; }
    }
    throw last instanceof Error ? last : new Error('AI_UNAVAILABLE');
  }
}
