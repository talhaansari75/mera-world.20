export type ScreenId =
  | "splash"
  | "home"
  | "worlds"
  | "modes"
  | "play"
  | "shop"
  | "pets"
  | "profile"
  | "settings"
  | "achievements"
  | "stats"
  | "daily"
  | "spin"
  | "story"
  | "dictionary"
  | "leaderboard"
  | "inventory"
  | "skills"
  | "base"
  | "equipment"
  | "combat"
  | "worldMap"
  | "storyQuests"
  | "dialogue"
  | "npcs"
  | "missions"
  | "legal"
  | "more"
  | "social"
  | "liveOps"
  | "systems"
  | "multiplayer"
  | "admin"
  | "payments"
  | "content"
  | "saveSlots"
  | "creator"
  | "progression"
  | "seasonProgress"
  | "creatorCommunity"
  | "analytics"
  | "accessibility"
  | "pwa"
  | "pushSettings"
  | "coach"
  | "adaptive"
  | "journeyPlanner"
  | "voice"
  | "aiPuzzleLab"
  | "puzzleAudit"
  | "playablePreview"
  | "creatorPlaytest"
  | "publishReadiness"
  | "releasePackage"
  | "releaseVerifier"
  | "releaseArchive";

export type GameMode =
  | "classic" | "timed" | "survival" | "blitz" | "zen" | "daily" | "endless"
  | "fog" | "mirror" | "category" | "boss"
  | "rush" | "precision" | "hardcore" | "double_reward" | "no_hints"
  | "small_grid" | "giant_grid" | "reverse_only" | "diagonal"
  | "orthogonal" | "chaos" | "streak" | "treasure" | "nightmare"
  | "focus" | "speedrun" | "marathon" | "random_rules";

export type LangCode =
  | "en"
  | "ur"
  | "ur-Latn"
  | "hi"
  | "ar"
  | "bn"
  | "pa"
  | "sd"
  | "ps"
  | "tr"
  | "es"
  | "fr"
  | "de"
  | "zh"
  | "ja";

export type Dir = readonly [number, number];

export type Placement = {
  word: string;
  row: number;
  col: number;
  dr: number;
  dc: number;
  cells: Array<[number, number]>;
};

export type Puzzle = {
  id: string;
  seed: number;
  size: number;
  grid: string[][];
  words: string[];
  placements: Placement[];
  category: string;
  title: string;
  hint?: string;
  dailyChallengeId?: string;
};

export type LevelSpec = {
  size: number;
  wordCount: number;
  directions: Dir[];
  minLen: number;
  maxLen: number;
  reverseWeight: number;
  timeLimit?: number;
};

export type LevelResult = {
  stars: 1 | 2 | 3;
  timeMs: number;
  found: number;
  hints: number;
  perfect: boolean;
};

export type CurrencyId = "coins" | "diamonds" | "stars" | "energy" | "xp";

export type PetId =
  | "dog"
  | "cat"
  | "eagle"
  | "dragon"
  | "unicorn"
  | "wolf"
  | "fox"
  | "turtle"
  | "owl"
  | "dolphin";

export type ClassId = "detective" | "scholar" | "explorer" | "warrior";

export type ThemeId =
  | "midnight"
  | "parchment"
  | "ocean"
  | "forest"
  | "ember"
  | "orchid"
  | "arctic"
  | "sakura";

export type PlayerSave = {
  version: number;
  playerName: string;
  avatarId: string;
  classId: ClassId;
  xp: number;
  coins: number;
  diamonds: number;
  stars: number;
  energy: number;
  energyAt: number;
  unlockedLevel: number;
  results: Record<string, LevelResult>;
  settings: GameSettings;
  ownedThemes: ThemeId[];
  ownedAvatars: string[];
  ownedPets: PetId[];
  petLevels: Partial<Record<PetId, number>>;
  petXp: Partial<Record<PetId, number>>;
  equippedPet: PetId | null;
  equippedTheme: ThemeId;
  achievements: string[];
  stats: PlayerStats;
  lastDaily: string | null;
  dailyStreak: number;
  behaviorProfile: import("./behavior").BehaviorProfile;
  lastSpin: string | null;
  lastLoginReward: string | null;
  skillPoints: number;
  skills: { speed: number; vision: number; luck: number };
  language: LangCode;
  storyChapter: number;
  inventory: string[];
  loginDays: number;
  baseBuildings: Record<import("./baseCrafting").BuildingId, number>;
  materials: Record<import("./baseCrafting").MaterialId, number>;
  equipment: import("./baseCrafting").Equipment[];
  equippedEquipment: Partial<Record<import("./baseCrafting").EquipmentSlot, string>>;
  claimedAchievements: string[];
  claimedMissions: string[];
  claimedSeasonTiers: string[];
};

export type GameSettings = {
  sfx: boolean;
  music: boolean;
  masterVol: number;
  sfxVol: number;
  musicVol: number;
  haptics: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  colorBlind: boolean;
  showTimer: boolean;
  showDirections: boolean;
  confirmExit: boolean;
  autoHint: boolean;
  snapSelect: boolean;
  gridLines: boolean;
  tileStyle: "carved" | "ink" | "neon";
  shake: boolean;
  particles: boolean;
  parentalLock: boolean;
  analytics: boolean;
  personalization: boolean;
  cloudSync: boolean;
  rtlForce: boolean;
  screenReader: boolean;
  dyslexiaFriendly: boolean;
  focusMode: boolean;
  notificationReminders: boolean;
  notificationTime: string;
};

export type PlayerStats = {
  gamesPlayed: number;
  gamesWon: number;
  wordsFound: number;
  hintsUsed: number;
  playTimeMs: number;
  bestStreak: number;
  currentStreak: number;
  perfectClears: number;
  coinsEarned: number;
  dailyCompleted: number;
  bossesDefeated: number;
  levelsCompleted: number;
};
