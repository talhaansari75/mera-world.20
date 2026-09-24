export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export const RARITY_WEIGHT: Record<Rarity, number> = { common: 70, rare: 20, epic: 8, legendary: 2 };

export function pityAdjustedRarity(pity: number): Rarity {
  if (pity >= 100) return 'legendary';
  if (pity >= 50) return 'epic';
  if (pity >= 20) return 'rare';
  return 'common';
}

export function rollRarity(random: number, pity = 0): Rarity {
  const forced = pityAdjustedRarity(pity);
  if (forced !== 'common') return forced;
  const x = Math.max(0, Math.min(0.999999, random)) * 100;
  if (x < 2) return 'legendary';
  if (x < 10) return 'epic';
  if (x < 30) return 'rare';
  return 'common';
}
