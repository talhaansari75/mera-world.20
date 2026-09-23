import { Bell, ChevronRight, ClipboardCheck, Crown, Flame, Gift, Map, PawPrint, Settings, ShoppingBag, Swords, Target, Trophy, User, Users, Wallet, Wrench } from "lucide-react";
import { useGame, playerLevel } from "@/lib/store";
import { xpForLevel } from "@/lib/game/economy";
import { TileButton, useT } from "./chrome";
import { unlockAudio, startMusic } from "@/lib/game/audio";
import { todayKey, worldOf, WORLDS } from "@/lib/game/levels";
import { DAILY_REWARD_COINS } from "@/lib/game/constants";
import { DailyRewardPopup } from "./JourneyPolish";

export function SplashScreen() {
  const t = useT();
  return (
    <button
      type="button"
      className="app-shell starfield safe-pad flex h-dvh w-full flex-col items-center justify-center gap-6 text-center"
      onClick={() => {
        unlockAudio();
        const save = useGame.getState().save;
        if (save.settings.music) startMusic();
        useGame.getState().go("home");
      }}
    >
      <p className="text-xs uppercase tracking-[0.28em] text-accent">Ink & Starlight</p>
      <h1 className="font-display max-w-[16ch] text-4xl leading-[1.05] text-fg sm:text-5xl">{t("app.title")}</h1>
      <p className="max-w-[28ch] text-muted">{t("app.tag")}</p>
      <span className="btn-primary max-w-xs">{t("cta.start")}</span>
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
    <div className="app-shell starfield safe-pad relative flex h-dvh flex-col overflow-y-auto pb-44 sm:pb-48">
      <header className="flex items-center justify-between gap-3 pb-1">
        <div className="flex min-w-0 items-center gap-3">
          <div className="dashboard-avatar">
            <span>{save.avatarId?.slice(0, 1)?.toUpperCase() || "✦"}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent">Ink & Starlight</p>
            <h1 className="truncate font-display text-2xl text-fg">{save.playerName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="dashboard-icon-btn" aria-label="Notifications"><Bell className="size-5" /></button>
          <button type="button" className="dashboard-icon-btn" onClick={() => useGame.getState().go("profile")} aria-label={t("cta.profile")}><User className="size-5" /></button>
        </div>
      </header>

      <div className="dashboard-currency-row">
        <button type="button" className="dashboard-currency" onClick={() => useGame.getState().go("shop")}><span className="currency-icon coin">◈</span><span><b>{save.coins.toLocaleString()}</b><small>Coins</small></span></button>
        <button type="button" className="dashboard-currency premium" onClick={() => useGame.getState().go("shop")}><span className="currency-icon gem">✦</span><span><b>{save.diamonds.toLocaleString()}</b><small>Diamonds</small></span><ChevronRight className="size-4 opacity-50" /></button>
        <div className="dashboard-currency"><span className="currency-icon energy">ϟ</span><span><b>{save.energy}</b><small>Energy</small></span></div>
      </div>

      <section className="dashboard-hero journey-hero animate-pop overflow-hidden rounded-[28px] p-5 sm:p-7">
        <div className="journey-hero-glow" />
        <div className="relative z-10 grid gap-6 md:grid-cols-[1.35fr_.65fr] md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="dashboard-kicker">Current expedition</span>
              <span className="dashboard-pill">World {WORLDS.findIndex((w) => w.id === world.id) + 1}</span>
            </div>
            <h2 className="max-w-[16ch] font-display text-4xl leading-none text-fg sm:text-5xl">{world.name}</h2>
            <p className="mt-2 max-w-[48ch] text-sm text-muted">Level {save.unlockedLevel} is waiting. Continue your journey and uncover the next hidden word.</p>
            <div className="mt-5 max-w-xl">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-muted"><span>Level {level}</span><span>{levelProgress}% XP</span></div>
              <div className="dashboard-progress"><span style={{ width: levelProgress + "%" }} /></div>
            </div>
            <button type="button" className="journey-continue btn-primary mt-5 max-w-md" onClick={() => useGame.getState().startLevel(save.unlockedLevel)}>
              <span><span className="block text-xs uppercase tracking-[0.2em] opacity-75">Continue Journey</span><strong className="block text-lg">Play Level {save.unlockedLevel}</strong></span><ChevronRight className="size-6" />
            </button>
          </div>
          <div className="dashboard-orbit" aria-hidden="true"><div className="dashboard-orbit-core">✦</div><div className="dashboard-orbit-ring ring-a" /><div className="dashboard-orbit-ring ring-b" /></div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="dashboard-stat"><span className="dashboard-stat-icon"><Flame className="size-5" /></span><div><b>{streak}</b><small>Day streak</small></div></div>
        <div className="dashboard-stat"><span className="dashboard-stat-icon"><Target className="size-5" /></span><div><b>{save.stats.levelsCompleted}</b><small>Levels cleared</small></div></div>
        <div className="dashboard-stat"><span className="dashboard-stat-icon"><Trophy className="size-5" /></span><div><b>{save.stats.perfectClears}</b><small>Perfect clears</small></div></div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
        <button type="button" className="dashboard-feature dashboard-feature-gold" onClick={() => useGame.getState().go("daily")}>
          <div><span className="dashboard-kicker text-yellow-200">Live today</span><h3 className="mt-1 font-display text-2xl text-white">Daily Discovery</h3><p className="mt-1 text-sm text-white/65">Keep your streak alive and earn bonus rewards.</p></div>
          <div className="dashboard-feature-icon">✧</div>
        </button>
        <button type="button" className="dashboard-feature dashboard-feature-purple" onClick={() => useGame.getState().go("shop")}>
          <div><span className="dashboard-kicker text-indigo-200">Premium</span><h3 className="mt-1 font-display text-2xl text-white">Diamond Vault</h3><p className="mt-1 text-sm text-white/65">Top up with USDC on Base.</p></div>
          <Wallet className="size-8 text-white/80" />
        </button>
      </section>

      {!claimed && <button type="button" className="dashboard-reward" onClick={() => useGame.getState().claimLogin()}>
        <span className="dashboard-reward-icon"><Gift className="size-5" /></span>
        <span className="min-w-0 flex-1 text-left"><b>Daily reward is ready</b><small>Day {(save.loginDays % 7) + 1} · Claim your free coins</small></span>
        <span className="dashboard-claim">Claim</span>
      </button>}

      <section className="dashboard-quick-travel mb-6">
        <div className="mb-3 flex items-end justify-between"><div><p className="dashboard-kicker">Quick travel</p><h3 className="font-display text-2xl text-fg">Your World</h3></div><button type="button" className="text-xs font-bold uppercase tracking-[0.15em] text-accent" onClick={() => useGame.getState().go("worlds")}>View map</button></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <TileButton icon={<Map className="size-5" />} label="World Map" onClick={() => useGame.getState().go("worldMap")} />
          <TileButton icon={<Users className="size-5" />} label="Multiplayer" onClick={() => useGame.getState().go("multiplayer")} />
          <TileButton icon={<Swords className="size-5" />} label="Modes" onClick={() => useGame.getState().go("modes")} />
          <TileButton icon={<User className="size-5" />} label="Profile" onClick={() => useGame.getState().go("profile")} />
        </div>     </section>

      <section className="mb-3 grid grid-cols-3 gap-2" aria-label="Quick tools">
        <button type="button" className="panel flex min-h-14 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-semibold text-fg" onClick={() => useGame.getState().go("settings")}><Settings className="size-5 text-primary" /><span>Settings</span></button>
        <button type="button" className="panel flex min-h-14 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-semibold text-fg" onClick={() => useGame.getState().go("more")}><Wrench className="size-5 text-primary" /><span>More</span></button>
        <button type="button" className="panel flex min-h-14 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-semibold text-fg" onClick={() => useGame.getState().go("featureTestLab")}><ClipboardCheck className="size-5 text-primary" /><span>Test Lab</span></button>
      </section>

      <nav className="dashboard-bottom-nav dashboard-bottom-nav-6" aria-label="Main navigation">
        <button type="button" className="active" onClick={() => useGame.getState().go("home")}><Map className="size-5" /><span>Home</span></button>
        <button type="button" onClick={() => useGame.getState().go("worlds")}><Target className="size-5" /><span>Worlds</span></button>
        <button type="button" onClick={() => useGame.getState().go("play")}><Swords className="size-5" /><span>Play</span></button>
        <button type="button" onClick={() => useGame.getState().go("multiplayer")}><Users className="size-5" /><span>Multiplayer</span></button>
        <button type="button" onClick={() => useGame.getState().go("shop")}><ShoppingBag className="size-5" /><span>Shop</span></button>
        <button type="button" onClick={() => useGame.getState().go("more")}><Wrench className="size-5" /><span>More</span></button>
      </nav>
    </div>
  );
}
