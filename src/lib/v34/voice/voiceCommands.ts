import type { ScreenId } from '@/lib/game/types';

export type VoiceCommand = { text: string; action: 'navigate' | 'back' | 'home' | 'unknown'; screen?: ScreenId };

const routes: Array<[RegExp, ScreenId]> = [
  [/\b(play|game|start)\b/, 'play'], [/\b(home|main)\b/, 'home'], [/\b(settings?|options?)\b/, 'settings'],
  [/\b(stats?|statistics|analytics)\b/, 'analytics'], [/\b(achievements?|trophies)\b/, 'achievements'],
  [/\b(missions?|quests?)\b/, 'missions'], [/\b(story)\b/, 'story'], [/\b(dictionary|words?)\b/, 'dictionary'],
  [/\b(leaderboard|rankings?)\b/, 'leaderboard'], [/\b(pets?|animals?)\b/, 'pets'], [/\b(combat|fight|battle)\b/, 'combat'],
  [/\b(multiplayer|online)\b/, 'multiplayer'], [/\b(creator|create puzzle)\b/, 'creator'],
  [/\b(community|creators)\b/, 'creatorCommunity'], [/\b(coach|smart coach)\b/, 'coach'],
  [/\b(adaptive|challenge)\b/, 'adaptive'], [/\b(planner|journey plan)\b/, 'journeyPlanner'],
  [/\b(accessibility|accessible)\b/, 'accessibility'], [/\b(offline|install|updates?)\b/, 'pwa'],
  [/\b(notifications?|push)\b/, 'pushSettings'], [/\b(more|menu)\b/, 'more'],
];

export function parseVoiceCommand(input: string): VoiceCommand {
  const text = input.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ');
  if (!text) return { text, action: 'unknown' };
  if (/\b(back|go back|previous)\b/.test(text)) return { text, action: 'back' };
  if (/\b(home|go home|main menu)\b/.test(text)) return { text, action: 'home', screen: 'home' };
  for (const [pattern, screen] of routes) if (pattern.test(text)) return { text, action: 'navigate', screen };
  return { text, action: 'unknown' };
}

export function speechLocale(lang: string): string {
  const map: Record<string, string> = { en: 'en-US', ur: 'ur-PK', 'ur-Latn': 'ur-PK', hi: 'hi-IN', ar: 'ar-SA', bn: 'bn-BD', pa: 'pa-IN', sd: 'sd-PK', ps: 'ps-AF', tr: 'tr-TR', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN', ja: 'ja-JP' };
  return map[lang] ?? 'en-US';
}
