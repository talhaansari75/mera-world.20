import { Bell, ChevronRight, Crown, Flame, Gift, Map, PawPrint, ShoppingBag, Swords, Target, Trophy, User, Wallet } from "lucide-react";
import { useGame, playerLevel } from "@/lib/store";
import { xpForLevel } from "@/lib/game/economy";
import { TileButton, useT } from "./chrome";
import { unlockAudio, startMusic } from "@/lib/game/audio";
import { todayKey, worldOf } from "@/lib/game/levels";
import { DAILY_REWARD_COINS } from "@/lib/game/constants";
import { DailyRewardPopup } from "./JourneyPolish";

export function SplashScreen() {
  const t = useT();
  return (
    <button
      type="button"
      className="app-shell starfield safe-pad flex h-dvh w-full flex-col items-center justify-center gap-5 overflow-hidden text-center"
      onClick={() => {
        unlockAudio();
        const save = useGame.getState().save;
        if (save.settings.music) startMusic();
        useGame.getState().go("home");
      }}
    >
      <div className="splash-logo-orbit" aria-hidden="true">
        <span className="splash-die">✦</span>
        <i>★</i><i>◆</i><i>✦</i><i>●</i>
      </div>
      <div className="splash-brand">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-yellow-200">MERA WORLD</p>
        <h1 className="mt-2 font-display text-5xl font-black leading-none text-white drop-shadow-[0_5px_0_rgba(94,4,83,.8)] sm:text-6xl">{t("app.title")}</h1>
        <p className="mx-auto mt-3 max-w-[30ch] text-sm font-semibold text-pink-100/90">{t("app.tag")}</p>
      </div>
      <div className="splash-loading"><span /><b>READY FOR YOUR NEXT JOURNEY</b></div>
      <span className="btn-primary max-w-xs shadow-[0_18px_40px_-18px_rgba(255,47,159,.95)]">{t("cta.start")}</span>
    </button>
  );
}

export function HomeScreen() {
  const t = useT();
  const save = useGame((s) => s.save);
  const world = worldOf(save.unlockedLevel);
  const claimed = save.lastLoginReward === todayKey();
  const level = playerLevel(save.xp);
  const levelBase = xpForLevel(level);
  const nextBase = xpForLevel(level + 1);
  const levelProgress = nextBase > levelBase ? Math.min(100, Math.round(((save.xp - levelBase) / (nextBase - levelBase)) * 100)) : 100;
  const streak = Math.max(save.dailyStreak, save.stats.currentStreak);

  return (
    <div className="app-shell starfield safe-pad flex h-dvh flex-col overflow-y-auto">
      <header className="arcade-topbar">
        <button type="button" className="arcade-profile-chip" onClick={() => useGame.getState().go("profile")} aria-label={t("cta.profile")}>
          <span className="arcade-avatar-ring">{save.avatarId?.slice(0, 1)?.toUpperCase() || "✦"}</span>
          <span className="min-w-0 text-left"><b>{save.playerName || "Traveler"}</b><small>Lv {level} · {world.name}</small></span>
        </button>
        <div className="arcade-currencies">
          <button type="button" className="arcade-currency-pill" onClick={() => useGame.getState().go("shop")}><span>◈</span><b>{save.coins.toLocaleString()}</b></button>
          <button type="button" className="arcade-currency-pill" onClick={() => useGame.getState().go("shop")}><span>✦</span><b>{save.diamonds.toLocaleString()}</b></button>
          <button type="button" className="arcade-icon-button" onClick={() => useGame.getState().go("settings")} aria-label={t("cta.settings")}>⚙</button>
        </div>
      </header>

      <section className="arcade-home-hero">
        <div className="arcade-hero-glow" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="arcade-ribbon">MERA WORLD</span>
            <span className="arcade-mini-badge">WORLD {world.world}</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-black leading-none text-white sm:text-5xl">Word Adventure Arena</h1>
          <p className="mt-2 max-w-[42ch] text-sm font-semibold text-white/75">A bright social game hub for your journey, daily challenges and live word battles.</p>
          <div className="mt-4 max-w-xl">
            <div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-[0.16em] text-white/65"><span>Level {level}</span><span>{levelProgress}% XP</span></div>
            <div className="arcade-xp-track"><span style={{ width: levelProgress + "%" }} /></div>
          </div>
          <button type="button" className="arcade-primary-cta mt-5" onClick={() => useGame.getState().startLevel(save.unlockedLevel)}>
            <span className="text-2xl">▶</span><span><small>CONTINUE JOURNEY</small><b>Play Level {save.unlockedLevel}</b></span><ChevronRight className="size-6" />
          </button>
        </div>
        <div className="arcade-hero-orbit" aria-hidden="true"><span>✦</span><i>◆</i><i>★</i><i>●</i></div>
      </section>

      <section className="arcade-section-head">
        <div><span>PLAY NOW</span><h2>Choose your table</h2></div>
        <span className="arcade-live-dot">● LIVE</span>
      </section>

      <section className="arcade-mode-grid">
        <button type="button" className="arcade-mode-card arcade-mode-duel" onClick={() => useGame.getState().go("multiplayer")}>
          <span className="arcade-mode-art">🔤⚔️</span>
          <span className="arcade-mode-copy"><small>LIVE MATCH</small><b>2 Player Word Duel</b><em>Real player first · bot fallback after 10s</em></span>
          <span className="arcade-mode-arrow">›</span>
        </button>
        <button type="button" className="arcade-mode-card arcade-mode-party" onClick={() => useGame.getState().go("modes")}>
          <span className="arcade-mode-art">🔤🎲</span>
          <span className="arcade-mode-copy"><small>SOLO + PARTY</small><b>World Challenge</b><em>Pick a puzzle mode and chase a high score</em></span>
          <span className="arcade-mode-arrow">›</span>
        </button>
      </section>

      <section className="arcade-mini-grid">
        <button type="button" className="arcade-mini-card arcade-mini-team" onClick={() => useGame.getState().go("multiplayer")}><span>🌍</span><b>Team Up Online</b><small>Play together</small></button>
        <button type="button" className="arcade-mini-card arcade-mini-private" onClick={() => useGame.getState().go("multiplayer")}><span>💬</span><b>Private Table</b><small>Invite a friend</small></button>
        <button type="button" className="arcade-mini-card arcade-mini-vip" onClick={() => useGame.getState().go("progression")}><span>👑</span><b>VIP Journey</b><small>Master your rank</small></button>
      </section>

      <section className="arcade-stat-strip">
        <div><b>{streak}</b><span>STREAK</span></div>
        <div><b>{save.stats.levelsCompleted}</b><span>LEVELS</span></div>
        <div><b>{save.stats.wordsFound.toLocaleString()}</b><span>WORDS</span></div>
        <div><b>{save.stats.gamesWon}</b><span>WINS</span></div>
      </section>

      {!claimed && (
        <button type="button" className="arcade-reward-banner" onClick={() => useGame.getState().claimLogin()}>
          <span className="arcade-reward-icon">🎁</span>
          <span><b>Free reward is ready!</b><small>Day {(save.loginDays % 7) + 1} · Claim your coins</small></span>
          <strong>CLAIM</strong>
        </button>
      )}

      <section className="arcade-quick-panel">
        <div className="arcade-section-head"><div><span>JOURNEY</span><h2>More to explore</h2></div></div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          <TileButton icon={<Map className="size-5" />} label={t("cta.worlds")} onClick={() => useGame.getState().go("worlds")} />
          <TileButton icon={<Swords className="size-5" />} label={t("cta.modes")} onClick={() => useGame.getState().go("modes")} />
          <TileButton icon={<PawPrint className="size-5" />} label={t("cta.pets")} onClick={() => useGame.getState().go("pets")} />
          <TileButton icon={<ShoppingBag className="size-5" />} label={t("cta.shop")} onClick={() => useGame.getState().go("shop")} />
          <TileButton icon={<Trophy className="size-5" />} label={t("cta.achievements")} onClick={() => useGame.getState().go("achievements")} />
        </div>
      </section>

      <nav className="dashboard-bottom-nav" aria-label="Main navigation">
        <button type="button" onClick={() => useGame.getState().go("shop")}><ShoppingBag className="size-5" /><span>Shop</span></button>
        <button type="button" onClick={() => useGame.getState().go("social")}><User className="size-5" /><span>Friends</span></button>
        <button type="button" className="active" onClick={() => useGame.getState().go("home")}><Map className="size-5" /><span>Home</span></button>
        <button type="button" onClick={() => useGame.getState().go("multiplayer")}><Swords className="size-5" /><span>Arena</span></button>
        <button type="button" onClick={() => useGame.getState().go("inventory")}><Gift className="size-5" /><span>Chest</span></button>
      </nav>
    </div>
  );
}
