import { create } from "zustand";
import type { GameMode, LevelResult, PetId, PlayerSave, Puzzle, ScreenId, ThemeId } from "./game/types";
import { ENERGY_COST, HINT_COST, MAX_ENERGY, MAX_LEVEL, PLAY_KEY, SPIN_COST } from "./game/constants";
import { loadSave, writeSave, mergeSaves, defaultSave, exportSave, importSave } from "./game/persist";
import { refillEnergy, coinsForClear, xpForClear, starsFor, playerLevel, xpForLevel, SHOP, SPIN_TABLE } from "./game/economy";
import { puzzleForLevel, puzzleForDaily, puzzleEndless, todayKey, isBoss, targetTimeMs, specFor } from "./game/levels";
import { unlockedAchievements, ACHIEVEMENTS, achievementProgress } from "./game/achievements";
import { isWord } from "./game/words";
import { PETS } from "./game/pets";
import { petUpgradeCost, petProfile, petEffect } from "./game/rpg";
import { sfxPlay, startMusic } from "./game/audio";
import { mulberry32, hashSeed } from "./game/rng";
import { rewardCoins, recordLevelResult } from "./game/core/progression";
import { modeRules } from "./game/core/modeRules";
import { validateModePath } from "./game/core/modeEngine";
import { startCombat, combatTurn, playerCombatPower, type CombatState } from "./game/combat";
import { DIALOGUES, dialogueForChapter } from "./game/dialogue";
import { BUILDINGS, buildingUpgradeCost, craftEquipment, type BuildingId, type EquipmentSlot, type MaterialId } from "./game/baseCrafting";
import { MISSIONS, periodKey } from "./game/missions";
import { gameEvents } from "./game/core/eventBus";
import { wireGameTelemetry } from "./game/services/gameTelemetry";
import { validatePlayerAction } from "./game/services/sessionSecurity";
import { installV9Integrations } from "./v9/integration/install";
import { installV18Offline } from "./v18/install";
import { validatePathInput } from "./v9/validation/actionGuard";
import { acceptAction } from "./v9/gameplay/sessionGuard";
import { claimAchievementServer, claimMissionServer, claimSeasonTierServer } from "./v26/progression/serverRewards";
import { seasonKey } from "./v26/progression/seasonRules";
import { startGameplaySession, recordGameplayAction, verifyGameplayCompletion, startBossSession, bossCombatAction } from "./server/gameplay";
import { JOURNEY_WORLDS, claimJourneyChest, journeyWorldForLevel, isJourneyBoss } from "./game/journeyWorlds";
import { petXpEarned } from "./game/engagement";
import { observeCompletion, observeFailure, observeQuit } from "./game/behavior";
import { applyIntelligenceEvent, personalizationEnabled } from "./intelligence/playerIntelligence";
import { intelligenceAdaptivePlan } from "./intelligence/adaptiveDifficulty";
import { personalizedRewardMultiplier } from "./intelligence/rewardPersonalization";
import { dailyChallengeFor, dailyChallengeRewardMultiplier, dailyChallengeObjective, type DailyChallenge } from "./game/dailyChallenges";

export type PlaySession = {
  kind: "level" | "daily" | "endless";
  level: number;
  mode: GameMode;
  puzzle: Puzzle;
  found: string[];
  bonus: string[];
  startAt: number;
  pausedAt: number | null;
  pausedMs: number;
  hints: number;
  revealed: Array<[number, number]>;
  mistakes: number;
  combo: number;
  round: number;
  timeLimit?: number;
  serverSessionId?: string;
  actions: Array<{ id?: string; type: "found" | "bonus" | "miss" | "hint" | "pause" | "resume"; word?: string; cells?: Array<[number, number]>; hintKind?: "first" | "letter" | "word" }>;
  dailyChallenge?: DailyChallenge;
  adaptiveTier?: "assist" | "steady" | "expert";
};

type Toast = { id: number; text: string } | null;

type GameState = {
  ready: boolean;
  save: PlayerSave;
  screen: ScreenId;
  prevScreen: ScreenId;
  play: PlaySession | null;
  toast: Toast;
  overlay: "win" | "fail" | "pause" | "reward" | null;
  lastReward: { coins: number; xp: number; stars: number; title: string } | null;
  hydrate: () => void;
  persist: () => void;
  patchSave: (fn: (s: PlayerSave) => PlayerSave) => void;
  go: (screen: ScreenId) => void;
  setScreen: (screen: ScreenId) => void;
  back: () => void;
  startLevel: (level: number, mode?: GameMode) => boolean;
  startDaily: () => boolean;
  startEndless: () => void;
  pausePlay: () => void;
  resumePlay: () => void;
  quitPlay: () => void;
  submitPath: (letters: string, cells: Array<[number, number]>) => "found" | "bonus" | "miss" | "repeat";
  useHint: (kind: "first" | "letter" | "word") => boolean;
  completePlay: () => void;
  failPlay: () => void;
  buy: (id: string) => boolean;
  buyPet: (id: PetId) => boolean;
  upgradePet: (id: PetId) => boolean;
  equipPet: (id: PetId) => void;
  equipTheme: (id: ThemeId) => void;
  setAvatar: (id: string) => void;
  setName: (name: string) => void;
  setSetting: <K extends keyof PlayerSave["settings"]>(k: K, v: PlayerSave["settings"][K]) => void;
  setLang: (lang: PlayerSave["language"]) => void;
  claimLogin: () => boolean;
  spin: () => string | null;
  spendSkill: (k: "speed" | "vision" | "luck") => void;
  upgradeBuilding: (id: BuildingId) => boolean;
  craft: (slot: EquipmentSlot) => boolean;
  equipEquipment: (id: string) => void;
  combat: CombatState | null;
  startBossCombat: (level: number) => Promise<void>;
  combatAction: (action: "word" | "guard" | "power", perfect?: boolean) => Promise<void>;
  clearCombat: () => void;
  claimWorldChest: (world: number) => boolean;
  dialogue: import("./game/dialogue").DialogueNode | null;
  npcAffinity: Record<string, number>;
  openDialogue: (chapter: number) => void;
  chooseDialogue: (choiceId: string) => void;
  closeDialogue: () => void;
  claimAchievement: (id:string)=>Promise<boolean>;
  claimMission: (id:string)=>Promise<boolean>;
  claimSeasonTier: (level:number)=>Promise<boolean>;
  applyCloud: (remote: PlayerSave) => void;
  applyServerSave: (remote: PlayerSave) => void;
  exportJson: () => string;
  importJson: (text: string) => boolean;
  resetProgress: () => void;
  now: () => number;
};

let toastN = 1;

type ServerGameplayAction = { sessionId: string; actionId: string; type: "found" | "bonus" | "miss" | "hint" | "pause" | "resume"; word?: string; cells?: Array<[number, number]>; hintKind?: "first" | "letter" | "word" };
const serverActionQueues = new Map<string, Promise<unknown>>();
const newActionId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const h = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
};
function flushPendingPlayActions(sessionId: string, play: PlaySession) {
  for (const action of play.actions) {
    if (!action.id) action.id = newActionId();
    void queueServerGameplayAction({ sessionId, actionId: action.id, type: action.type, word: action.word, cells: action.cells, hintKind: action.hintKind });
  }
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
function queueServerGameplayAction(data: ServerGameplayAction) {
  const run = async () => {
    let last: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await recordGameplayAction({ data });
        if (!result.ok) throw new Error(result.error ?? "Gameplay action rejected by server");
        if (result.save) get().applyServerSave(result.save as PlayerSave);
        if (result.hintEconomy) {
          get().patchSave((s) => ({ ...s, coins: result.hintEconomy!.coins, stats: { ...s.stats, hintsUsed: result.hintEconomy!.hintsUsed } }));
        }
        return result;
      } catch (error) { last = error; if (attempt < 2) await sleep(75 * 2 ** attempt); }
    }
    return { ok: false as const, error: last instanceof Error ? last.message : "Gameplay action delivery failed" };
  };
  const previous = serverActionQueues.get(data.sessionId) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(run);
  serverActionQueues.set(data.sessionId, next);
  void next.then(() => {
    if (serverActionQueues.get(data.sessionId) === next) serverActionQueues.delete(data.sessionId);
  }, () => {
    if (serverActionQueues.get(data.sessionId) === next) serverActionQueues.delete(data.sessionId);
  });
  return next;
}

const pendingServerStarts = new Map<string, Promise<unknown>>();

function flash(set: (p: Partial<GameState>) => void, text: string) {
  const id = toastN++;
  set({ toast: { id, text } });
  setTimeout(() => {
    useGame.setState((s) => (s.toast?.id === id ? { toast: null } : s));
  }, 2200);
}

function withAchievements(save: PlayerSave): PlayerSave {
  const ids = unlockedAchievements(save);
  const extra = ids.filter((id) => !save.achievements.includes(id));
  if (!extra.length) return save;
  return { ...save, achievements: [...save.achievements, ...extra] };
}

function haptic(ms = 12) {
  try {
    if (useGame.getState().save.settings.haptics && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  } catch {
    /* ignore */
  }
}

function persistPlay(play: PlaySession | null) {
  if (typeof sessionStorage === "undefined") return;
  try {
    if (!play) sessionStorage.removeItem(PLAY_KEY);
    else sessionStorage.setItem(PLAY_KEY, JSON.stringify(play));
  } catch {
    /* ignore */
  }
}

export const useGame = create<GameState>((set, get) => ({
  ready: false,
  save: defaultSave(),
  screen: "splash",
  prevScreen: "home",
  play: null,
  toast: null,
  overlay: null,
  lastReward: null,
  combat: null,
  dialogue: null,
  npcAffinity: {},

  hydrate: () => {
    wireGameTelemetry();
    installV9Integrations();
    installV18Offline();
    let save = refillEnergy(loadSave());
    save = withAchievements(save);
    let play: PlaySession | null = null;
    try {
      const raw = sessionStorage.getItem(PLAY_KEY);
      if (raw) play = JSON.parse(raw) as PlaySession;
    } catch {
      play = null;
    }
    set({ ready: true, save, play, screen: play ? "play" : "splash", overlay: play?.pausedAt ? "pause" : null });
  },

  persist: () => writeSave(get().save),

  patchSave: (fn) => {
    const save = withAchievements(refillEnergy(fn(get().save)));
    writeSave(save);
    set({ save });
    gameEvents.emit("save:changed", { version: save.version });
  },

  go: (screen) =>
    set((s) => ({
      prevScreen: s.screen === "play" ? s.prevScreen : s.screen,
      screen,
      overlay: screen === "play" ? s.overlay : null,
    })),
  setScreen: (screen) => {
    get().go(screen);
  },

  back: () =>
    set((s) => ({
      screen: s.screen === "play" ? s.prevScreen : s.prevScreen === s.screen ? "home" : s.prevScreen,
      overlay: null,
    })),

  now: () => Date.now(),

  startLevel: (level, mode = "classic") => {
    const { save } = get();
    const filled = refillEnergy(save);
    const rules = modeRules(mode);
    const free = rules.free;
    const petFx = petEffect(filled.equippedPet, filled.equippedPet ? (filled.petLevels[filled.equippedPet] ?? 1) : 1);
    const energyCost = Math.max(1, Math.ceil(ENERGY_COST * rules.energyMultiplier * (1 - (petFx.energyReductionPercent ?? 0) / 100)));
    if (!free && filled.energy < energyCost) {
      flash(set, "Need energy");
      set({ save: filled, screen: "shop" });
      return false;
    }
    if (level > filled.unlockedLevel) return false;
    const puzzle = puzzleForLevel(level, mode, filled.language);
    const spec = specFor(level);
    const adaptive = intelligenceAdaptivePlan(filled, level);
    const vision = filled.skills.vision + (petFx.startingReveals ?? 0);
    const revealed: Array<[number, number]> = [];
    if (vision > 0 && puzzle.placements[0]) {
      revealed.push(puzzle.placements[0].cells[0]!);
    }
    const play: PlaySession = {
      kind: "level",
      level,
      mode,
      puzzle,
      found: [],
      bonus: [],
      startAt: Date.now(),
      pausedAt: null,
      pausedMs: 0,
      hints: 0,
      revealed,
      mistakes: 0,
      combo: 0,
      round: 0,
      timeLimit: mode === "zen" || spec.timeLimit == null
        ? undefined
        : Math.max(20, Math.floor(spec.timeLimit * rules.timeMultiplier * (1 + (petFx.timeBonusPercent ?? 0) / 100))),
      actions: [],
    };
    const online = typeof navigator !== "undefined" && navigator.onLine;
    const next = online || free ? filled : { ...filled, energy: filled.energy - energyCost, energyAt: Date.now() };
    writeSave(next);
    persistPlay(play);
    const intelligenceStarted = personalizationEnabled(filled)
      ? applyIntelligenceEvent(next, { type: "level_start", level, mode })
      : next;
    writeSave(intelligenceStarted);
    set({ save: intelligenceStarted, play, screen: "play", overlay: null });
    if (typeof navigator !== "undefined" && navigator.onLine) {
      const startPromise = startGameplaySession({ data: { kind: "level", level, mode, language: filled.language } })
        .then((result) => {
          const current = get().play;
          if (result.ok && current?.kind === "level" && current.level === level) {
            const updated = { ...current, serverSessionId: result.sessionId, timeLimit: result.timeLimitMs / 1000, adaptiveTier: result.adaptiveTier };
            persistPlay(updated);
            set({ play: updated });
            flushPendingPlayActions(result.sessionId, updated);
            if (!free) get().applyServerSave(result.save as PlayerSave);
          } else if (!result.ok && current?.kind === "level" && current.level === level) {
            persistPlay(null);
            set({ play: null, overlay: null, screen: get().prevScreen === "play" ? "home" : get().prevScreen });
            flash(set, result.error);
          }
          return result;
        });
      pendingServerStarts.set(`${level}:${mode}`, startPromise);
      void startPromise.then(() => undefined, () => undefined).finally(() => pendingServerStarts.delete(`${level}:${mode}`)).catch(() => undefined);
    }
    gameEvents.emit("level:start", { level, mode, seed: puzzle.seed });
    startMusic(journeyWorldForLevel(level).world - 1);
    return true;
  },

  startDaily: () => {
    const day = todayKey();
    const { save } = get();
    const challenge = dailyChallengeFor(day);
    const puzzle = puzzleForDaily(day, save.language, challenge.id);
    const play: PlaySession = {
      kind: "daily",
      level: 0,
      mode: "daily",
      puzzle,
      found: [],
      bonus: [],
      startAt: Date.now(),
      pausedAt: null,
      pausedMs: 0,
      hints: 0,
      revealed: [],
      mistakes: 0,
      combo: 0,
      round: 0,
      timeLimit: challenge.id === "speed" ? 90 : 150,
      actions: [],
      dailyChallenge: challenge,
    };
    persistPlay(play);
    set({ play, screen: "play", overlay: null, save });
    if (typeof navigator !== "undefined" && navigator.onLine) {
      const startPromise = startGameplaySession({ data: { kind: "daily", level: 0, day, mode: "daily", language: save.language, dailyChallengeId: challenge.id } })
        .then((result) => {
          const current = get().play;
          if (result.ok && current?.kind === "daily") {
            const updated = { ...current, serverSessionId: result.sessionId, timeLimit: result.timeLimitMs / 1000, adaptiveTier: result.adaptiveTier };
            persistPlay(updated);
            set({ play: updated });
            flushPendingPlayActions(result.sessionId, updated);
          }
          return result;
        });
      pendingServerStarts.set(`daily:${day}`, startPromise);
      void startPromise.then(() => undefined, () => undefined).finally(() => pendingServerStarts.delete(`daily:${day}`)).catch(() => undefined);
    }
    gameEvents.emit("level:start", { level: 0, mode: "daily", seed: puzzle.seed });
    return true;
  },

  startEndless: () => {
    const seed = hashSeed("end", get().save.playerName, Date.now() % 99991);
    const puzzle = puzzleEndless(0, seed, get().save.language);
    const play: PlaySession = {
      kind: "endless",
      level: seed,
      mode: "endless",
      puzzle,
      found: [],
      bonus: [],
      startAt: Date.now(),
      pausedAt: null,
      pausedMs: 0,
      hints: 0,
      revealed: [],
      mistakes: 0,
      combo: 0,
      round: 0,
      actions: [],
    };
    persistPlay(play);
    set({ play, screen: "play", overlay: null });
    gameEvents.emit("level:start", { level: 0, mode: "endless", seed: puzzle.seed });
  },

  pausePlay: () => {
    const play = get().play;
    if (!play || play.pausedAt) return;
    if (play.kind === "daily" && play.dailyChallenge?.id === "speed") { flash(set, "Speed Day cannot be paused."); return; }
    const actionId = newActionId();
    const next = { ...play, pausedAt: Date.now(), actions: [...play.actions, { id: actionId, type: "pause" as const }] };
    persistPlay(next);
    set({ play: next, overlay: "pause" });
    if (next.serverSessionId) void queueServerGameplayAction({sessionId:next.serverSessionId,actionId,type:"pause"});
  },

  resumePlay: () => {
    const play = get().play;
    if (!play?.pausedAt) {
      set({ overlay: null });
      return;
    }
    const actionId = newActionId();
    const next = { ...play, pausedMs: play.pausedMs + (Date.now() - play.pausedAt), pausedAt: null, actions: [...play.actions, { id: actionId, type: "resume" as const }] };
    persistPlay(next);
    set({ play: next, overlay: null });
    if (next.serverSessionId) void queueServerGameplayAction({sessionId:next.serverSessionId,actionId,type:"resume"});
  },

  quitPlay: () => {
    const play = get().play;
    if (play) get().patchSave((s) => applyIntelligenceEvent(s, { type: "session_end", level: play.level, completedLevels: play.found.length ? 1 : 0 }));
    persistPlay(null);
    set({ play: null, overlay: null, screen: get().prevScreen === "play" ? "home" : get().prevScreen });
  },

  submitPath: (letters, cells) => {
    const play = get().play;
    if (!play || play.pausedAt) return "miss";
    try { validatePlayerAction(`local:${play.level}`, "submitPath"); } catch { return "miss"; }
    if (!validatePathInput(letters, cells) || !acceptAction(`local:${play.level}`, "submitPath")) return "miss";
    const rules = modeRules(play.mode);
    const modeCheck = validateModePath(play.mode, cells, play.puzzle.placements);
    if (!modeCheck.ok) {
      flash(set, modeCheck.reason ?? "Rule not allowed");
      return "miss";
    }
    const forward = letters.toUpperCase();
    const backward = [...forward].reverse().join("");
    const targets = play.puzzle.words;
    const match = targets.find((w) => w === forward || w === backward);
    if (match) {
      if (play.found.includes(match)) return "repeat";
      sfxPlay.found(play.combo + 1);
      haptic(18);
      const found = [...play.found, match];
      const extraCells = play.puzzle.placements.find((p) => p.word === match)?.cells ?? cells;
      const revealed = [...play.revealed, ...extraCells];
      const next: PlaySession = { ...play, found, revealed, combo: play.combo + 1, actions: [...play.actions, { id: newActionId(), type: "found", word: match, cells }] };
      persistPlay(next);
      set({ play: next });
      if (next.serverSessionId) void queueServerGameplayAction({sessionId:next.serverSessionId,actionId:next.actions[next.actions.length - 1]!.id!,type:"found",word:match,cells});
      gameEvents.emit("word:found", { word: match, index: found.length - 1, combo: next.combo });
      get().patchSave((s) => ({
        ...s,
        stats: { ...s.stats, wordsFound: s.stats.wordsFound + 1 },
      }));
      if (found.length >= targets.length) {
        const challenge = next.dailyChallenge;
        const objective = dailyChallengeObjective(challenge, { perfect: next.hints === 0 && next.mistakes === 0, combo: next.combo, bonusWords: next.bonus.length });
        if (objective.met) setTimeout(() => get().completePlay(), 280);
      }
      return "found";
    }
    if (forward.length >= 4 && isWord(forward) && !play.bonus.includes(forward)) {
      sfxPlay.coin();
      const next: PlaySession = { ...play, bonus: [...play.bonus, forward], combo: play.combo + 1, actions: [...play.actions, { id: newActionId(), type: "bonus", word: forward, cells }] };
      persistPlay(next);
      set({ play: next });
      if (next.serverSessionId) void queueServerGameplayAction({sessionId:next.serverSessionId,actionId:next.actions[next.actions.length - 1]!.id!,type:"bonus",word:forward,cells});
      get().patchSave((s) => ({ ...s, coins: s.coins + 4, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + 4 } }));
      if (next.dailyChallenge && next.found.length >= next.puzzle.words.length) {
        const objective = dailyChallengeObjective(next.dailyChallenge, { perfect: next.hints === 0 && next.mistakes === 0, combo: next.combo, bonusWords: next.bonus.length });
        if (objective.met) setTimeout(() => get().completePlay(), 280);
      }
      return "bonus";
    }
    sfxPlay.miss();
    haptic(8);
    const next: PlaySession = { ...play, mistakes: play.mistakes + 1, combo: 0, actions: [...play.actions, { id: newActionId(), type: "miss", word: forward, cells }] };
    persistPlay(next);
    set({ play: next });
    if (next.serverSessionId) void queueServerGameplayAction({sessionId:next.serverSessionId,actionId:next.actions[next.actions.length - 1]!.id!,type:"miss",word:forward,cells});
    gameEvents.emit("word:miss", { letters: forward });
    if (rules.maxMistakes != null && next.mistakes >= rules.maxMistakes) {
      setTimeout(() => get().failPlay(), 200);
    }
    return "miss";
  },

  useHint: (kind) => {
    const play = get().play;
    if (!play) return false;
    if (modeRules(play.mode).noHints) {
      flash(set, "Hints are disabled in this mode");
      return false;
    }
    const remaining = play.puzzle.placements.filter((p) => !play.found.includes(p.word));
    const target = remaining[0];
    if (!target) return false;
    const fox = get().save.equippedPet === "fox";
    const cost = Math.max(5, HINT_COST[kind] - (fox && kind !== "word" ? 8 : 0));
    const next = play;
    const online = typeof navigator !== "undefined" && navigator.onLine && Boolean(next.serverSessionId);
    if (!online && get().save.coins < cost) {
      flash(set, "Need coins");
      return false;
    }

    const actionId = newActionId();
    const revealCells = () => {
      let revealed = get().play?.revealed.slice() ?? [];
      if (kind === "first") revealed.push(target.cells[0]!);
      else if (kind === "letter") {
        const idx = Math.min(target.cells.length - 1, 1 + Math.floor(Math.random() * Math.max(1, target.cells.length - 1)));
        revealed.push(target.cells[idx]!);
      } else revealed = [...revealed, ...target.cells];
      const current = get().play;
      if (!current) return;
      const next: PlaySession = {
        ...current,
        hints: current.hints + 1,
        revealed,
        actions: [...current.actions, { id: actionId, type: "hint" as const, hintKind: kind }],
      };
      persistPlay(next);
      set({ play: next });
      if (personalizationEnabled(get().save)) get().patchSave((s) => applyIntelligenceEvent(s, { type: "hint_used", level: current.level }));
      sfxPlay.hint();
    };

    if (online && play.serverSessionId) {
      void queueServerGameplayAction({sessionId:play.serverSessionId,actionId,type:"hint",hintKind:kind}).then((result: any) => {
        if (!result?.ok) { flash(set, result?.error ?? "Hint was rejected by the server."); return; }
        if (result.hintEconomy) {
          get().patchSave((s) => ({ ...s, coins: result.hintEconomy.coins, stats: { ...s.stats, hintsUsed: result.hintEconomy.hintsUsed } }));
        }
        revealCells();
      }).catch(() => flash(set, "Hint could not be verified. Please retry."));
      return true;
    }

    if (get().save.coins < cost) {
      flash(set, "Need coins");
      return false;
    }
    revealCells();
    get().patchSave((s) => ({ ...s, coins: s.coins - cost, stats: { ...s.stats, hintsUsed: s.stats.hintsUsed + 1 } }));
    return true;
  },

  completePlay: async () => {
    let play = get().play;
    if (!play) return;
    if ((play.kind === "level" || play.kind === "daily") && typeof navigator !== "undefined" && navigator.onLine && !play.serverSessionId) {
      const pending = pendingServerStarts.get(play.kind === "daily" ? `daily:${todayKey()}` : `${play.level}:${play.mode}`);
      if (pending) await pending;
      play = get().play;
      if (!play?.serverSessionId) { flash(set, "Secure game session could not be started. Please retry."); return; }
    }
    const elapsed = Date.now() - play.startAt - play.pausedMs;
    const target = targetTimeMs(play.level || 1, play.puzzle.words.length, play.puzzle.size);
    const stars = starsFor({ hints: play.hints, timeMs: elapsed, targetMs: target, mistakes: play.mistakes });
    const perfect = play.hints === 0 && play.mistakes === 0;
    const boss = play.kind === "level" && isBoss(play.level);
    const key = play.kind === "daily" ? `daily-${todayKey()}` : play.kind === "endless" ? `end-${play.round}` : String(play.level);
    const firstClear = play.kind === "level" && !get().save.results[key];
    const rules = modeRules(play.mode);
    const fastBonus = elapsed <= target * 0.72 ? 18 : 0;
    const goldenBonus = Math.floor(play.found.length / 5) * 10;
    const dailyClaimed = play.kind === "daily" && get().save.lastDaily === todayKey();
    const dailyMultiplier = dailyChallengeRewardMultiplier(play.dailyChallenge, { perfect, combo: play.combo, bonusWords: play.bonus.length });
    const rewardKind = play.kind === "daily" ? "challenge" : play.combo >= 5 ? "speed" : get().save.equippedPet ? "pet" : boss ? "collection" : "standard";
    const personalizationMultiplier = personalizedRewardMultiplier(get().save, rewardKind);
    const coins = dailyClaimed ? 0 : Math.max(1, Math.floor(rewardCoins({
      mode: play.mode, stars, combo: play.combo, hints: play.hints, mistakes: play.mistakes,
      wordCount: play.puzzle.words.length + play.bonus.length, boss, firstClear,
    }) * rules.rewardMultiplier * dailyMultiplier * personalizationMultiplier * (1 + (petEffect(get().save.equippedPet, get().save.equippedPet ? (get().save.petLevels[get().save.equippedPet] ?? 1) : 1).coinBonusPercent ?? 0) / 100)) + fastBonus + goldenBonus);
    const xp = Math.floor(xpForClear({ size: play.puzzle.size, stars, boss }) * (1 + (petEffect(get().save.equippedPet, get().save.equippedPet ? (get().save.petLevels[get().save.equippedPet] ?? 1) : 1).xpBonusPercent ?? 0) / 100));
    const dragon = get().save.equippedPet === "dragon" && perfect ? 20 : 0;
    const petId = get().save.equippedPet;
    const petXp = petId && !dailyClaimed ? petXpEarned({ perfect, boss }) : 0;

    if (play.kind === "endless") {
      const round = play.round + 1;
      const puzzle = puzzleEndless(round, play.level, get().save.language);
      const next: PlaySession = {
        ...play,
        puzzle,
        found: [],
        bonus: [],
        startAt: Date.now(),
        pausedAt: null,
        pausedMs: 0,
        hints: 0,
        revealed: [],
        mistakes: 0,
        combo: 0,
        round,
        actions: [],
      };
      persistPlay(next);
      get().patchSave((s) => ({
        ...observeCompletion(s, { level: play.level, world: 1, category: play.puzzle.category, mode: play.mode, timeMs: elapsed, hints: play.hints, combo: play.combo, perfect, stars, pet: petId, rewardCoins: coins + dragon }),
        coins: s.coins + coins + dragon,
        xp: s.xp + xp,
        stats: { ...s.stats, gamesWon: s.stats.gamesWon + 1, wordsFound: s.stats.wordsFound, coinsEarned: s.stats.coinsEarned + coins + dragon, currentStreak: s.stats.currentStreak + 1, bestStreak: Math.max(s.stats.bestStreak, s.stats.currentStreak + 1) },
      }));
      set({ play: next, overlay: null });
      sfxPlay.coin();
      return;
    }

    if (play.serverSessionId) {
      try {
        const queued = serverActionQueues.get(play.serverSessionId);
        if (queued) {
          const delivery = await queued as { ok?: boolean; error?: string };
          if (delivery.ok === false) { flash(set, delivery.error ?? "Gameplay action delivery failed. Please retry."); return; }
        }
        const verified = await verifyGameplayCompletion({ data: { sessionId: play.serverSessionId, found: play.found, paths: play.actions.filter(a => a.type === "found").map(a => ({ word: a.word ?? "", cells: a.cells ?? [] })) } });
        if (!verified.ok) { flash(set, verified.error); return; }
        if (verified.save) get().applyServerSave(verified.save as PlayerSave);
        persistPlay(null);
        sfxPlay.win();
        set({ overlay: "win", lastReward: { coins: verified.coins ?? 0, xp: verified.xp ?? 0, stars: verified.stars ?? 0, title: play.puzzle.title }, play: { ...play, found: play.puzzle.words.slice() } });
        gameEvents.emit("level:complete", { level: play.level, stars: verified.stars ?? 0, timeMs: elapsed });
        return;
      } catch { flash(set, "Secure result verification failed. Please retry."); return; }
    }
    persistPlay(null);
    sfxPlay.win();
    if (petId && petXp > 0) {
      get().patchSave((s) => ({
        ...s,
        petXp: { ...s.petXp, [petId]: (s.petXp[petId] ?? 0) + petXp },
      }));
    }
    if (play.kind === "level") {
      const world = journeyWorldForLevel(play.level);
      const collectibleIds = [
        ...(isBoss(play.level) ? [`guardian-trophy-${world.world}`] : []),
        ...(JOURNEY_WORLDS.some((w) => w.to === play.level) ? [`world-artifact-${world.world}`] : []),
      ];
      if (collectibleIds.length) get().patchSave((s) => ({ ...s, inventory: Array.from(new Set([...s.inventory, ...collectibleIds])) }));
    }
    if (!play.serverSessionId) {
      get().patchSave((s) => {
      const prev = playerLevel(s.xp);
      const nextXp = s.xp + xp;
      const nextLv = playerLevel(nextXp);
      const skillGain = Math.max(0, nextLv - prev);
      const unlockedLevel =
        play.kind === "level" ? Math.min(MAX_LEVEL, Math.max(s.unlockedLevel, play.level + 1)) : s.unlockedLevel;
      const result: LevelResult = { stars, timeMs: elapsed, found: play.found.length, hints: play.hints, perfect };
      const behaviorized = applyIntelligenceEvent(s, { type: "level_complete", level: play.level, world: journeyWorldForLevel(Math.max(1, play.level)).world, category: play.puzzle.category, mode: play.mode, timeMs: elapsed, hints: play.hints, combo: play.combo, perfect, stars, pet: petId, rewardCoins: coins + dragon, daily: play.kind === "daily" });
      const progressed = play.kind === "level" ? recordLevelResult(behaviorized, play.level, result) : behaviorized;
      const results = progressed.results;
      const finalUnlocked = play.kind === "level" ? progressed.unlockedLevel : unlockedLevel;
      const storyChapter = Math.max(s.storyChapter, Math.floor((finalUnlocked - 1) / 100));
      return {
        ...s,
        coins: s.coins + coins + dragon,
        xp: nextXp,
        stars: s.stars + stars,
        unlockedLevel: finalUnlocked,
        results,
        skillPoints: s.skillPoints + skillGain,
        storyChapter,
        lastDaily: play.kind === "daily" && !dailyClaimed ? todayKey() : s.lastDaily,
        dailyStreak: play.kind === "daily" && !dailyClaimed ? (s.lastDaily === new Date(Date.now() - 86400000).toISOString().slice(0,10) ? s.dailyStreak + 1 : 1) : s.dailyStreak,
        stats: {
          ...s.stats,
          gamesPlayed: s.stats.gamesPlayed + 1,
          gamesWon: s.stats.gamesWon + 1,
          playTimeMs: s.stats.playTimeMs + elapsed,
          coinsEarned: s.stats.coinsEarned + coins + dragon,
          currentStreak: s.stats.currentStreak + 1,
          bestStreak: Math.max(s.stats.bestStreak, s.stats.currentStreak + 1),
          perfectClears: s.stats.perfectClears + (perfect ? 1 : 0),
          dailyCompleted: s.stats.dailyCompleted + (play.kind === "daily" && !dailyClaimed ? 1 : 0),
          bossesDefeated: s.stats.bossesDefeated + (boss ? 1 : 0),
          levelsCompleted: s.stats.levelsCompleted + (play.kind === "level" ? 1 : 0),
        },
        inventory: Array.from(new Set([
          ...s.inventory,
          ...(play.kind === "level" && play.level > 0 && isBoss(play.level) ? [`guardian-trophy-${journeyWorldForLevel(play.level).world}`] : []),
          ...(play.kind === "level" && JOURNEY_WORLDS.some((w) => w.to === play.level) ? [`world-artifact-${journeyWorldForLevel(play.level).world}`] : []),
        ])),
        materials: {
          ...s.materials,
          wood: s.materials.wood + 1 + (boss ? 2 : 0),
          stone: s.materials.stone + (stars >= 2 ? 1 : 0),
          crystal: s.materials.crystal + (perfect ? 1 : 0),
        },
      };
      });
    }
    gameEvents.emit("level:complete", { level: play.level, stars, timeMs: elapsed });
    set({
      overlay: "win",
      lastReward: { coins: coins + dragon, xp, stars, title: play.puzzle.title },
      play: { ...play, found: play.puzzle.words.slice() },
    });
  },

  failPlay: () => {
    const play = get().play;
    if (!play) return;
    persistPlay(null);
    get().patchSave((s) => ({
      ...applyIntelligenceEvent(s, { type: "level_fail", level: play.level, reason: "rule_or_timeout" }),
      stats: {
        ...s.stats,
        gamesPlayed: s.stats.gamesPlayed + 1,
        currentStreak: 0,
        playTimeMs: s.stats.playTimeMs + (Date.now() - play.startAt - play.pausedMs),
      },
    }));
    gameEvents.emit("level:fail", { level: play.level, reason: "rule_or_timeout" });
    set({ overlay: "fail" });
  },

  buy: (id) => {
    const item = SHOP.find((x) => x.id === id);
    if (!item) return false;
    const save = get().save;
    if ("theme" in item && item.theme && save.ownedThemes.includes(item.theme as ThemeId)) {
      flash(set, "Already owned");
      return false;
    }
    if (save.coins < item.coins || save.diamonds < item.diamonds) {
      flash(set, item.coins && save.coins < item.coins ? "Need coins" : "Need diamonds");
      return false;
    }
    get().patchSave((s) => {
      let next = { ...s, coins: s.coins - item.coins, diamonds: s.diamonds - item.diamonds };
      if (item.kind === "energy") next = { ...next, energy: Math.min(MAX_ENERGY, next.energy + item.amount) };
      if (item.kind === "coins") next = { ...next, coins: next.coins + item.amount };
      if (item.kind === "item") next = { ...next, inventory: [...next.inventory, String(item.item)] };
      if ("theme" in item && item.theme) {
        next = { ...next, ownedThemes: [...new Set([...next.ownedThemes, item.theme as ThemeId])] };
      }
      return next;
    });
    sfxPlay.coin();
    flash(set, "Purchased");
    return true;
  },

  buyPet: (id) => {
    const pet = PETS.find((p) => p.id === id);
    if (!pet) return false;
    const save = get().save;
    if (save.ownedPets.includes(id)) return false;
    if (save.coins < pet.coins || save.diamonds < pet.diamonds) {
      flash(set, "Need currency");
      return false;
    }
    get().patchSave((s) => ({
      ...s,
      coins: s.coins - pet.coins,
      diamonds: s.diamonds - pet.diamonds,
      ownedPets: [...s.ownedPets, id],
      petLevels: { ...s.petLevels, [id]: 1 },
    }));
    sfxPlay.coin();
    return true;
  },

  upgradePet: (id) => {
    const save = get().save;
    if (!save.ownedPets.includes(id)) return false;
    const profile = petProfile(id);
    const level = save.petLevels[id] ?? 1;
    if (!profile || level >= profile.maxLevel) return false;
    const cost = petUpgradeCost(id, level);
    if (save.coins < cost) { flash(set, "Need coins"); return false; }
    get().patchSave((s) => ({
      ...s,
      coins: s.coins - cost,
      petLevels: { ...s.petLevels, [id]: level + 1 },
    }));
    flash(set, `${profile.name} reached level ${level + 1}`);
    return true;
  },

  equipPet: (id) => get().patchSave((s) => (s.ownedPets.includes(id) ? { ...s, equippedPet: id } : s)),
  equipTheme: (id) => get().patchSave((s) => (s.ownedThemes.includes(id) ? { ...s, equippedTheme: id } : s)),
  setAvatar: (id) => get().patchSave((s) => ({ ...s, avatarId: id })),
  setName: (name) => get().patchSave((s) => ({ ...s, playerName: name.slice(0, 24) || s.playerName })),
  setSetting: (k, v) => get().patchSave((s) => ({ ...s, settings: { ...s.settings, [k]: v } })),
  setLang: (language) => get().patchSave((s) => ({ ...s, language })),

  claimLogin: () => {
    const day = todayKey();
    if (get().save.lastLoginReward === day) return false;
    const dayIndex = get().save.loginDays % 7;
    const coins = [10, 20, 35, 50, 75, 100, 150][dayIndex]!;
    get().patchSave((s) => ({
      ...s,
      coins: s.coins + coins,
      lastLoginReward: day,
      loginDays: s.loginDays + 1,
      diamonds: s.diamonds + (dayIndex === 6 ? 1 : 0),
      stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + coins },
    }));
    sfxPlay.coin();
    flash(set, `+${coins} coins`);
    return true;
  },

  spin: () => {
    const save = refillEnergy(get().save);
    const day = todayKey();
    const paid = save.lastSpin === day;
    if (paid && save.coins < SPIN_COST) {
      flash(set, "Need coins");
      return null;
    }
    const luck = save.skills.luck + (save.equippedPet === "unicorn" ? 2 : 0);
    const rng = mulberry32(hashSeed("spin", day, save.loginDays, Date.now() % 997));
    const table = SPIN_TABLE.map((row, i) => (i >= 5 ? { ...row, w: row.w + luck } : row));
    const total = table.reduce((a, r) => a + r.w, 0);
    let roll = rng() * total;
    let hit = table[0]!;
    for (const row of table) {
      roll -= row.w;
      if (roll <= 0) {
        hit = row;
        break;
      }
    }
    get().patchSave((s) => ({
      ...s,
      coins: s.coins - (paid ? SPIN_COST : 0) + hit.coins,
      diamonds: s.diamonds + hit.diamonds,
      energy: Math.min(MAX_ENERGY, s.energy + hit.energy),
      lastSpin: day,
      stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + hit.coins },
    }));
    sfxPlay.spin();
    return hit.label;
  },

  upgradeBuilding: (id) => {
    const save = get().save;
    const level = save.baseBuildings[id] ?? 1;
    const cost = buildingUpgradeCost(id, level);
    if (cost == null) return false;
    if (save.coins < cost) { flash(set, "Not enough coins"); return false; }
    get().patchSave((s) => ({
      ...s,
      coins: s.coins - cost,
      baseBuildings: { ...s.baseBuildings, [id]: level + 1 },
    }));
    flash(set, `${BUILDINGS[id].name} upgraded`);
    return true;
  },

  craft: (slot) => {
    const save = get().save;
    const level = Math.max(1, save.baseBuildings.workshop ?? 1);
    const item = craftEquipment(slot, level, save.materials);
    if (!item) { flash(set, "Need more crafting materials"); return false; }
    const spend: Partial<Record<MaterialId, number>> = { wood: 5 + level, stone: 4 + level, crystal: 2, iron: 2, gold: 0 };
    get().patchSave((s) => {
      const materials = { ...s.materials };
      for (const [k,v] of Object.entries(spend)) materials[k as MaterialId] = Math.max(0, (materials[k as MaterialId] ?? 0) - Number(v));
      return { ...s, materials, equipment: [...s.equipment, item] };
    });
    flash(set, `Crafted ${item.name}`);
    return true;
  },

  equipEquipment: (id) => {
    get().patchSave((s) => {
      const item = s.equipment.find((e) => e.id === id);
      if (!item) return s;
      return { ...s, equippedEquipment: { ...s.equippedEquipment, [item.slot]: id } };
    });
  },

  spendSkill: (k) => {
    get().patchSave((s) => {
      if (s.skillPoints < 1 || s.skills[k] >= 10) return s;
      return { ...s, skillPoints: s.skillPoints - 1, skills: { ...s.skills, [k]: s.skills[k] + 1 } };
    });
  },

  applyCloud: (remote) => {
    const merged = mergeSaves(get().save, remote);
    writeSave(merged);
    set({ save: merged });
    flash(set, "Cloud save merged");
  },

  applyServerSave: (remote) => {
    const merged = { ...remote };
    writeSave(merged);
    set({ save: merged });
  },

  startBossCombat: async (level) => {
    const save = get().save;
    if (!isJourneyBoss(level) || level > save.unlockedLevel) { flash(set, "Reach an unlocked Boss Gate first"); return; }
    try {
      const result = await startBossSession({data:{level}});
      if (!result.ok) { flash(set,result.error); return; }
      set({ combat: {...(result.combat as CombatState), sessionId:result.sessionId} as CombatState & {sessionId:string}, screen:"combat" });
    } catch { flash(set,"Guardian connection failed"); }
  },

  combatAction: async (action, perfect) => {
    const combat = get().combat;
    if (!combat || combat.victory || combat.defeated) return;
    const sessionId = (combat as CombatState & {sessionId?:string}).sessionId;
    // Session id is stored on the local combat object by startBossCombat below.
    if (!sessionId) { flash(set,"Guardian session missing"); return; }
    try {
      const result = await bossCombatAction({data:{sessionId,action,perfect}});
      if (!result.ok) { flash(set,result.error); return; }
      set({combat:{...(result.combat as CombatState),sessionId} as CombatState & {sessionId:string}});
      if (result.combat.victory) {
        if (result.save) { writeSave(result.save as PlayerSave); set({save:result.save as PlayerSave}); }
        flash(set, `Victory · +${result.combat.enemy.reward} coins`); sfxPlay.win();
      }
    } catch { flash(set,"Guardian action failed"); }
  },

  clearCombat: () => set({ combat: null, screen: "home" }),

  openDialogue: (chapter) => {
    set({ dialogue: dialogueForChapter(chapter), screen: "dialogue" });
  },

  chooseDialogue: (choiceId) => {
    const node = get().dialogue;
    if (!node) return;
    const choice = node.choices.find((c) => c.id === choiceId);
    if (!choice) return;
    if (choice.affinity) {
      set({ npcAffinity: { ...get().npcAffinity, [node.speaker]: (get().npcAffinity[node.speaker] ?? 0) + choice.affinity } });
    }
    if (choice.reward) {
      get().patchSave((s) => ({ ...s, coins: s.coins + choice.reward! }));
      flash(set, `+${choice.reward} coins`);
    }
    if (!choice.next || choice.next === "end") {
      set({ dialogue: null, screen: "npcs" });
      return;
    }
    const next = DIALOGUES[choice.next];
    set({ dialogue: next ?? null, screen: next ? "dialogue" : "npcs" });
  },

  closeDialogue: () => set({ dialogue: null, screen: "npcs" }),

  claimAchievement: async (id) => {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) return false;
    const save = get().save;
    if (save.claimedAchievements.includes(id) || !achievementProgress(a, save.stats).done) return false;
    try {
      const remote = await claimAchievementServer({ data: { id } });
      if (!remote.ok) { flash(set, remote.error ?? "Achievement claim failed"); return false; }
      if (remote.reward > 0) {
        get().patchSave((s) => ({ ...s, claimedAchievements: [...s.claimedAchievements, id], coins: s.coins + remote.reward, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + remote.reward } }));
        flash(set, `+${remote.reward} coins`); sfxPlay.coin();
      }
      return true;
    } catch {
      // Offline-first fallback: local claim remains playable; cloud sync can reconcile later.
      get().patchSave((s) => ({ ...s, claimedAchievements: [...s.claimedAchievements, id], coins: s.coins + a.reward, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + a.reward } }));
      flash(set, `+${a.reward} coins`); sfxPlay.coin();
      return true;
    }
  },

  claimMission: async (id) => {
    const m = MISSIONS.find((x) => x.id === id);
    if (!m) return false;
    const save = get().save;
    const ck = `${m.id}:${periodKey(m.period)}`;
    const k = m.metric === "levels" ? "levelsCompleted" : m.metric === "words" ? "wordsFound" : "coinsEarned";
    if (save.claimedMissions.includes(ck) || (save.stats[k] ?? 0) < m.target) return false;
    try {
      const remote = await claimMissionServer({ data: { id } });
      if (!remote.ok) { flash(set, remote.error ?? "Mission claim failed"); return false; }
      if (remote.reward > 0) {
        get().patchSave((s) => ({ ...s, claimedMissions: [...s.claimedMissions, ck], coins: s.coins + remote.reward, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + remote.reward } }));
        flash(set, `+${remote.reward} coins`); sfxPlay.coin();
      }
      return true;
    } catch {
      get().patchSave((s) => ({ ...s, claimedMissions: [...s.claimedMissions, ck], coins: s.coins + m.reward, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + m.reward } }));
      flash(set, `+${m.reward} coins`); sfxPlay.coin();
      return true;
    }
  },

  claimSeasonTier: async (level) => {
    const tier = Math.max(1, Math.min(10, Math.floor(level)));
    const save = get().save;
    const key = `${seasonKey()}:${tier}`;
    if (save.claimedSeasonTiers.includes(key)) return false;
    try {
      const remote = await claimSeasonTierServer({ data: { level: tier } });
      if (!remote.ok) {
        flash(set, remote.error ?? "Season claim failed");
        return false;
      }
      if (remote.reward > 0) {
        get().patchSave((s) => ({ ...s, claimedSeasonTiers: [...s.claimedSeasonTiers, key], coins: s.coins + remote.reward, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + remote.reward } }));
        flash(set, `+${remote.reward} coins`); sfxPlay.coin();
      }
      return true;
    } catch {
      flash(set, "Sign in with a cloud save to claim season rewards");
      return false;
    }
  },

  exportJson: () => exportSave(get().save),

  importJson: (text) => {
    try {
      const next = importSave(text);
      writeSave(next);
      set({ save: next });
      flash(set, "Save imported");
      return true;
    } catch {
      flash(set, "Import failed");
      return false;
    }
  },

  resetProgress: () => {
    const keep = get().save.settings;
    const lang = get().save.language;
    const next = { ...defaultSave(), settings: keep, language: lang };
    writeSave(next);
    persistPlay(null);
    set({ save: next, play: null, overlay: null, screen: "home" });
  },
}));

export { playerLevel, xpForLevel };
