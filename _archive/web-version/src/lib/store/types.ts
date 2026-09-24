// Core Zustand slice & state types for Mera Word Search Journey
export interface UIState {
  screen: string;
  toast: string | null;
  overlay: string | null;
}

export interface EconomyState {
  coins: number;
  energy: number;
  gems: number;
}

export interface PlayState {
  currentLevel: number;
  isPlaying: boolean;
  score: number;
}
