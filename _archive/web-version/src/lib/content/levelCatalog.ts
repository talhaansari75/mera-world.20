export type LevelTier = 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'legend';
export type LevelCatalogEntry = { id: string; number: number; tier: LevelTier; size: number; wordCount: number; tags: string[]; version: number };

export function tierForLevel(n: number): LevelTier {
  if (n <= 100) return 'easy'; if (n <= 300) return 'medium'; if (n <= 600) return 'hard'; if (n <= 900) return 'expert'; if (n <= 1000) return 'master'; return 'legend';
}
export function buildCatalog(max = 2000): LevelCatalogEntry[] {
  return Array.from({ length: max }, (_, i) => {
    const n = i + 1, tier = tierForLevel(n);
    const sizes = { easy: 8, medium: 10, hard: 12, expert: 14, master: 16, legend: 20 } as const;
    const counts = { easy: 5, medium: 7, hard: 9, expert: 12, master: 15, legend: 20 } as const;
    return { id: `level-${n}`, number: n, tier, size: sizes[tier], wordCount: counts[tier] + (tier === 'legend' ? Math.min(20, Math.floor((n - 1001) / 100)) : 0), tags: [tier, n % 100 === 0 ? 'milestone' : 'standard'], version: 1 };
  });
}
