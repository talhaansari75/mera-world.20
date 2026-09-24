export const SAVE_VERSION = 2;
export const SAVE_KEY = "mwsj.save.v1";
export const PLAY_KEY = "mwsj.play.v1";
export const MAX_LEVEL = 2000;
export const MAX_ENERGY = 20;
export const ENERGY_REFILL_MS = 5 * 60 * 1000;
export const ENERGY_COST = 1;
export const HINT_COST = { first: 10, letter: 20, word: 50 } as const;
export const SPIN_COST = 25;
export const DAILY_REWARD_COINS = [10, 20, 35, 50, 75, 100, 150] as const;
export const PLAYER_XP_PER_LEVEL = 80;

export const DIRS_4 = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
] as const;

export const DIRS_8 = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

export const FILL_LETTERS = "EEEEEEEEETTTTTAAAAAAAOOOOOOIIIIINNNNNSSSSSSRRRRRHHHHHLLLLDDDCCCUUUMMMWWWFFGGYYPPBBVKJXQZ";
