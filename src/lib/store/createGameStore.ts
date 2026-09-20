import { create } from 'zustand';
import { createUISlice, type UISlice } from './slices/uiSlice';
import { createEconomySlice, type EconomySlice } from './slices/economySlice';
import { createPlaySlice, type PlaySlice } from './slices/playSlice';

export type GameStore = UISlice & EconomySlice & PlaySlice;

export const useGame = create<GameStore>()((...a) => ({
  ...createUISlice(...a),
  ...createEconomySlice(...a),
  ...createPlaySlice(...a),
}));
