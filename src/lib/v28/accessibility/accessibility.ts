import type { GameSettings } from "@/lib/game/types";

export type AccessibilityPreset = "default" | "low-motion" | "high-clarity" | "focus";

export function applyAccessibilityPreset(settings: GameSettings, preset: AccessibilityPreset): GameSettings {
  if (preset === "low-motion") return { ...settings, reducedMotion: true, shake: false, particles: false };
  if (preset === "high-clarity") return { ...settings, highContrast: true, largeText: true, gridLines: true, showDirections: true };
  if (preset === "focus") return { ...settings, reducedMotion: true, shake: false, particles: false, showDirections: false, autoHint: false };
  return settings;
}

export function accessibilitySummary(s: GameSettings) {
  return [
    s.highContrast && "high contrast",
    s.largeText && "large text",
    s.reducedMotion && "reduced motion",
    s.colorBlind && "color-blind support",
    s.dyslexiaFriendly && "dyslexia-friendly text",
    s.focusMode && "focus mode",
  ].filter(Boolean) as string[];
}
