import { BookOpen, Gift, Map, PawPrint, Settings, ShoppingBag, Sparkles, Swords, Trophy, User } from "lucide-react";
import { useGame, playerLevel } from "@/lib/store";
import { HudChips, TileButton, useT } from "./chrome";
import { unlockAudio, startMusic } from "@/lib/game/audio";
import { todayKey, worldOf } from "@/lib/game/levels";
import { WORD_COUNT } from "@/lib/game/words";
import { DAILY_REWARD_COINS } from "@/lib/game/constants";
import { DailyRewardPopup, JourneyHero } from "./JourneyPolish";
import { recommendFor } from "@/lib/intelligence/playerIntelligence";
import { recommendLiveEvent } from "@/lib/intelligence/liveEventPersonalization";

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
  return (
    <div className="app-shell starfield safe-pad flex h-dvh flex-col gap-4 overflow-y-auto">
      <header className="flex items-center justify-between gap-3">
        <div><p className="text-xs uppercase tracking-[0.2em] text-accent">{save.playerName}</p><h1 className="font-display text-2xl text-fg">{t("app.title")}</h1></div>
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-xl panel" onClick={() => useGame.getState().go("profile")} aria-label={t("cta.profile")}><User className="size-5" /></button>
      </header>
      <HudChips />
      <JourneyHero />
      {(() => {
        const rec = recommendFor(save);
        const live = recommendLiveEvent(save);
        return <div className="grid gap-2" aria-label="Personalized recommendations"><div className="panel rounded-2xl p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.2em] text-accent">For You</p><p className="font-semibold text-fg">{rec.title}</p><p className="text-xs text-muted">{rec.detail}</p></div><span className="text-lg">✨</span></div></div><div className="panel rounded-2xl p-4"><p className="text-[10px] uppercase tracking-[0.2em] text-gold">Live Now</p><p className="font-semibold text-fg">{live.title}</p><p className="text-xs text-muted">{live.detail}</p></div></div>;
      })()}
      <button type="button" className="journey-continue btn-primary animate-pop" onClick={() => useGame.getState().startLevel(save.unlockedLevel)}>
        <span><span className="block text-xs uppercase tracking-[0.2em] opacity-80">Continue Journey</span><strong className="block text-lg">Level {save.unlockedLevel} · {world.name}</strong></span><span className="text-2xl">→</span>
      </button>
      {!claimed && <button type="button" className="panel flex items-center justify-between rounded-2xl p-4 text-left" onClick={() => useGame.getState().claimLogin()}><span><span className="flex items-center gap-2 text-sm font-semibold text-fg"><Gift className="size-4 text-gold" /> Daily reward ready</span><span className="text-xs text-muted">Day {(save.loginDays % 7) + 1} · +{DAILY_REWARD_COINS[save.loginDays % 7]} coins</span></span><span className="text-sm font-semibold text-primary">Claim</span></button>}
      <div className="grid grid-cols-3 gap-2">
        <TileButton icon={<Map className="size-5" />} label={t("cta.worlds")} onClick={() => useGame.getState().go("worlds")} />
        <TileButton icon={<Sparkles className="size-5" />} label={t("cta.daily")} onClick={() => useGame.getState().go("daily")} />
        <TileButton icon={<Swords className="size-5" />} label={t("cta.modes")} onClick={() => useGame.getState().go("modes")} />
        <TileButton icon={<ShoppingBag className="size-5" />} label={t("cta.shop")} onClick={() => useGame.getState().go("shop")} />
        <TileButton icon={<PawPrint className="size-5" />} label={t("cta.pets")} onClick={() => useGame.getState().go("pets")} />
        <TileButton icon={<Trophy className="size-5" />} label={t("cta.achievements")} onClick={() => useGame.getState().go("achievements")} />
        <TileButton icon={<Gift className="size-5" />} label={t("cta.spin")} onClick={() => useGame.getState().go("spin")} />
        <TileButton icon={<BookOpen className="size-5" />} label={t("cta.story")} onClick={() => useGame.getState().go("story")} />
        <TileButton icon={<Settings className="size-5" />} label={t("cta.more")} onClick={() => useGame.getState().go("more")} />
      </div>
      <DailyRewardPopup />
    </div>
  );
}
