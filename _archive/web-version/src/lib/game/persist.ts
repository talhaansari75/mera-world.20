import type { GameSettings, LangCode, PlayerSave, PlayerStats } from "./types.ts";
import { MAX_ENERGY, SAVE_KEY, SAVE_VERSION } from "./constants.ts";
import { defaultBehaviorProfile, normalizeBehaviorProfile } from "./behavior.ts";

export function defaultSettings(): GameSettings {
  return {
    sfx: true,
    music: true,
    masterVol: 0.8,
    sfxVol: 0.7,
    musicVol: 0.45,
    haptics: true,
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    colorBlind: false,
    showTimer: true,
    showDirections: true,
    confirmExit: true,
    autoHint: false,
    snapSelect: true,
    gridLines: true,
    tileStyle: "carved",
    shake: true,
    particles: true,
    parentalLock: false,
    analytics: false,
    personalization: true,
    cloudSync: true,
    rtlForce: false,
    screenReader: false,
    dyslexiaFriendly: false,
    focusMode: false,
    notificationReminders: false,
    notificationTime: "19:00",
  };
}

export function defaultStats(): PlayerStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    wordsFound: 0,
    hintsUsed: 0,
    playTimeMs: 0,
    bestStreak: 0,
    currentStreak: 0,
    perfectClears: 0,
    coinsEarned: 0,
    dailyCompleted: 0,
    bossesDefeated: 0,
    levelsCompleted: 0,
  };
}

export function defaultSave(): PlayerSave {
  return {
    version: SAVE_VERSION,
    playerName: "Traveler",
    avatarId: "ink-1",
    profileImage: null,
    classId: "explorer",
    xp: 0,
    coins: 120,
    diamonds: 5,
    stars: 0,
    energy: MAX_ENERGY,
    energyAt: Date.now(),
    unlockedLevel: 1,
    results: {},
    settings: defaultSettings(),
    ownedThemes: ["midnight", "parchment"],
    ownedAvatars: ["ink-1", "ink-2", "ink-3"],
    ownedPets: ["dog"],
    petLevels: { dog: 1 },
    petXp: { dog: 0 },
    equippedPet: "dog",
    equippedTheme: "midnight",
    achievements: [],
    stats: defaultStats(),
    lastDaily: null,
    dailyStreak: 0,
    behaviorProfile: defaultBehaviorProfile(),
    lastSpin: null,
    lastLoginReward: null,
    skillPoints: 0,
    skills: { speed: 0, vision: 0, luck: 0 },
    language: "en",
    storyChapter: 0,
    inventory: ["starter-pack"],
    loginDays: 1,
    baseBuildings: { camp: 1, workshop: 1, forge: 1, library: 1, treasury: 1 },
    materials: { wood: 40, stone: 30, crystal: 10, iron: 5, gold: 0 },
    equipment: [],
    equippedEquipment: {},
    claimedAchievements: [],
    claimedMissions: [],
    claimedSeasonTiers: [],
  };
}

function isLang(v: unknown): v is LangCode {
  return (
    typeof v === "string" &&
    [
      "en",
      "ur",
      "ur-Latn",
      "hi",
      "ar",
      "bn",
      "pa",
      "sd",
      "ps",
      "tr",
      "es",
      "fr",
      "de",
      "zh",
      "ja",
    ].includes(v)
  );
}

export function migrateSave(raw: unknown): PlayerSave {
  const base = defaultSave();
  if (!raw || typeof raw !== "object") return base;
  const s = raw as Partial<PlayerSave>;
  const merged: PlayerSave = {
    ...base,
    ...s,
    version: SAVE_VERSION,
    settings: { ...base.settings, ...(s.settings ?? {}) },
    stats: { ...base.stats, ...(s.stats ?? {}) },
    skills: { ...base.skills, ...(s.skills ?? {}) },
    results: s.results && typeof s.results === "object" ? s.results : {},
    profileImage: typeof s.profileImage === "string" && s.profileImage.length <= 140000 ? s.profileImage : base.profileImage,
    ownedThemes: Array.isArray(s.ownedThemes) ? s.ownedThemes : base.ownedThemes,
    ownedAvatars: Array.isArray(s.ownedAvatars) ? s.ownedAvatars : base.ownedAvatars,
    ownedPets: Array.isArray(s.ownedPets) ? s.ownedPets : base.ownedPets,
    petLevels: s.petLevels && typeof s.petLevels === "object" ? s.petLevels : base.petLevels,
    petXp: s.petXp && typeof s.petXp === "object" ? s.petXp : base.petXp,
    achievements: Array.isArray(s.achievements) ? s.achievements : [],
    inventory: Array.isArray(s.inventory) ? s.inventory : base.inventory,
    language: isLang(s.language) ? s.language : "en",
    baseBuildings: s.baseBuildings && typeof s.baseBuildings === "object" ? { ...base.baseBuildings, ...s.baseBuildings } : base.baseBuildings,
    materials: s.materials && typeof s.materials === "object" ? { ...base.materials, ...s.materials } : base.materials,
    equipment: Array.isArray(s.equipment) ? s.equipment : base.equipment,
    equippedEquipment: s.equippedEquipment && typeof s.equippedEquipment === "object" ? s.equippedEquipment : base.equippedEquipment,
    claimedAchievements: Array.isArray(s.claimedAchievements) ? s.claimedAchievements : [],
    claimedMissions: Array.isArray(s.claimedMissions) ? s.claimedMissions : [],
    claimedSeasonTiers: Array.isArray(s.claimedSeasonTiers) ? s.claimedSeasonTiers : [],
    dailyStreak: Number.isFinite(s.dailyStreak) ? Math.max(0, Math.floor(s.dailyStreak!)) : base.dailyStreak,
    behaviorProfile: normalizeBehaviorProfile(s.behaviorProfile),
  };
  if (!Number.isFinite(merged.coins)) merged.coins = base.coins;
  if (!Number.isFinite(merged.energy)) merged.energy = base.energy;
  if (merged.unlockedLevel < 1) merged.unlockedLevel = 1;
  return merged;
}

function isGuestSession(): boolean {
  return typeof sessionStorage !== "undefined" && sessionStorage.getItem("mera-world.guest.session") === "1";
}

export function loadSave(): PlayerSave {
  if (isGuestSession()) return defaultSave();
  if (typeof localStorage === "undefined") return defaultSave();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    return migrateSave(JSON.parse(raw));
  } catch {
    try {
      const bak = localStorage.getItem(SAVE_KEY + ".bak");
      if (bak) return migrateSave(JSON.parse(bak));
    } catch {
      /* ignore */
    }
    return defaultSave();
  }
}

export function writeSave(save: PlayerSave) {
  if (isGuestSession()) return;
  if (typeof localStorage === "undefined") return;
  try {
    const prev = localStorage.getItem(SAVE_KEY);
    if (prev) localStorage.setItem(SAVE_KEY + ".bak", prev);
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    /* quota / private mode */
  }
}

export function exportSave(save: PlayerSave) {
  return JSON.stringify({ ...save, exportedAt: Date.now() }, null, 2);
}

export function importSave(text: string): PlayerSave {
  return migrateSave(JSON.parse(text));
}

export function mergeSaves(a: PlayerSave, b: PlayerSave): PlayerSave {
  const results = { ...a.results };
  for (const [k, v] of Object.entries(b.results)) {
    const cur = results[k];
    if (!cur || v.stars > cur.stars || (v.stars === cur.stars && v.timeMs < cur.timeMs)) {
      results[k] = v;
    }
  }
  return {
    ...a,
    playerName: a.playerName || b.playerName,
    profileImage: a.profileImage || b.profileImage,
    xp: Math.max(a.xp, b.xp),
    coins: Math.max(a.coins, b.coins),
    diamonds: Math.max(a.diamonds, b.diamonds),
    stars: Math.max(a.stars, b.stars),
    energy: Math.max(a.energy, b.energy),
    unlockedLevel: Math.max(a.unlockedLevel, b.unlockedLevel),
    results,
    ownedThemes: [...new Set([...a.ownedThemes, ...b.ownedThemes])],
    ownedAvatars: [...new Set([...a.ownedAvatars, ...b.ownedAvatars])],
    ownedPets: [...new Set([...a.ownedPets, ...b.ownedPets])],
    achievements: [...new Set([...a.achievements, ...b.achievements])],
    inventory: [...new Set([...a.inventory, ...b.inventory])],
    storyChapter: Math.max(a.storyChapter, b.storyChapter),
    loginDays: Math.max(a.loginDays, b.loginDays),
    dailyStreak: Math.max(a.dailyStreak, b.dailyStreak),
    stats: {
      gamesPlayed: Math.max(a.stats.gamesPlayed, b.stats.gamesPlayed),
      gamesWon: Math.max(a.stats.gamesWon, b.stats.gamesWon),
      wordsFound: Math.max(a.stats.wordsFound, b.stats.wordsFound),
      hintsUsed: Math.max(a.stats.hintsUsed, b.stats.hintsUsed),
      playTimeMs: Math.max(a.stats.playTimeMs, b.stats.playTimeMs),
      bestStreak: Math.max(a.stats.bestStreak, b.stats.bestStreak),
      currentStreak: Math.max(a.stats.currentStreak, b.stats.currentStreak),
      perfectClears: Math.max(a.stats.perfectClears, b.stats.perfectClears),
      coinsEarned: Math.max(a.stats.coinsEarned, b.stats.coinsEarned),
      dailyCompleted: Math.max(a.stats.dailyCompleted, b.stats.dailyCompleted),
      bossesDefeated: Math.max(a.stats.bossesDefeated, b.stats.bossesDefeated),
      levelsCompleted: Math.max(a.stats.levelsCompleted ?? 0, b.stats.levelsCompleted ?? 0),
    },
    petLevels: { ...a.petLevels, ...b.petLevels },
    lastDaily: laterDate(a.lastDaily, b.lastDaily),
    lastSpin: laterDate(a.lastSpin, b.lastSpin),
    lastLoginReward: laterDate(a.lastLoginReward, b.lastLoginReward),
    claimedAchievements: [...new Set([...a.claimedAchievements, ...b.claimedAchievements])],
    claimedMissions: [...new Set([...a.claimedMissions, ...b.claimedMissions])],
  };
}

function laterDate(a: string | null, b: string | null) {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}
