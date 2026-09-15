import { useEffect, useState } from "react";
import { Gift, Lock, PawPrint, Sparkles, Star, Trophy, X, Zap } from "lucide-react";
import { useGame, playerLevel } from "@/lib/store";
import { todayKey, worldOf, WORLDS } from "@/lib/game/levels";
import { journeyWorldForLevel } from "@/lib/game/journeyWorlds";
import { petEvolutionName, petXpFor, petXpProgress, worldRestoration } from "@/lib/game/engagement";
import { DAILY_REWARD_COINS } from "@/lib/game/constants";
import { petById } from "@/lib/game/pets";
import { startMusic, unlockAudio } from "@/lib/game/audio";

const WORLD_ART = ["🌿", "💎", "🏜️", "❄️", "🌲", "☁️"];

export function JourneyLoading() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setProgress((p) => Math.min(100, p + 8)), 70);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="journey-loading app-shell starfield safe-pad grid h-dvh place-items-center text-center">
      <div className="w-full max-w-sm px-6">
        <div className="journey-orb mx-auto mb-5">✦</div>
        <p className="text-xs uppercase tracking-[0.35em] text-accent">Ink & Starlight</p>
        <h1 className="mt-2 font-display text-4xl text-fg">Mera Word Search Journey</h1>
        <p className="mx-auto mt-2 max-w-[30ch] text-sm text-muted">Words become paths. Paths become adventures.</p>
        <div className="mt-7 h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
        <p className="mt-2 text-xs text-muted">Preparing your journey… {progress}%</p>
      </div>
    </div>
  );
}

export function DailyRewardPopup() {
  const save = useGame((s) => s.save);
  const [open, setOpen] = useState(false);
  const claimed = save.lastLoginReward === todayKey();
  useEffect(() => {
    if (!claimed) setOpen(true);
  }, [claimed]);
  if (!open || claimed) return null;
  const day = save.loginDays % 7;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-5 backdrop-blur-sm">
      <div className="reward-modal panel w-full max-w-sm rounded-3xl p-6 text-center">
        <button className="absolute right-5 top-5 text-muted" onClick={() => setOpen(false)} aria-label="Close"><X className="size-5" /></button>
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-gold/15"><Gift className="size-8 text-gold" /></div>
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-gold">Daily Journey Reward</p>
        <h2 className="mt-1 font-display text-3xl text-fg">Day {(day % 7) + 1} Chest</h2>
        <p className="mt-2 text-sm text-muted">Keep your streak alive. Your next reward gets better.</p>
        <div className="my-5 grid grid-cols-3 gap-2">
          <div className="reward-pill"><Sparkles className="mx-auto size-5 text-accent" /><b>{DAILY_REWARD_COINS[day % 7]}</b><span>Coins</span></div>
          <div className="reward-pill"><Zap className="mx-auto size-5 text-gold" /><b>{Math.min(7, day + 1)}</b><span>Streak</span></div>
          <div className="reward-pill"><Star className="mx-auto size-5 text-gold" /><b>{day === 6 ? "CHEST" : "+XP"}</b><span>Bonus</span></div>
        </div>
        <button className="btn-primary" onClick={() => { unlockAudio(); if (save.settings.music) startMusic(); useGame.getState().claimLogin(); setOpen(false); }}>Claim Reward</button>
      </div>
    </div>
  );
}

export function JourneyHero() {
  const save = useGame((s) => s.save);
  const world = worldOf(save.unlockedLevel);
  const journeyWorld = journeyWorldForLevel(save.unlockedLevel);
  const lv = playerLevel(save.xp);
  const restoration = worldRestoration(save, journeyWorld);
  const progress = restoration.percent;
  const pet = save.equippedPet ? petById(save.equippedPet) : null;
  const petProgress = petXpProgress(petXpFor(save.equippedPet, save));
  return (
    <section className="journey-hero panel overflow-hidden rounded-[28px] p-5">
      <div className="journey-hero-glow" />
      <div className="relative flex items-center justify-between gap-3">
        <div><p className="text-xs uppercase tracking-[0.22em] text-accent">Your adventure</p><h2 className="mt-1 font-display text-3xl text-fg">{world.name}</h2><p className="mt-1 text-sm text-muted">Level {save.unlockedLevel} · Rank {lv}</p></div>
        <div className="pet-hero" title={pet?.name ?? "Companion"}>{pet ? "🐾" : "✦"}<span /></div>
      </div>
      <div className="journey-route mt-5">
        {WORLDS.slice(0, 6).map((w, i) => <div key={w.id} className={`journey-node ${w.id === world.id ? "is-current" : ""} ${save.unlockedLevel >= w.from ? "is-open" : "is-locked"}`}><span>{save.unlockedLevel >= w.from ? WORLD_ART[i] : <Lock className="size-3" />}</span><small>{w.name.split(" ")[0]}</small></div>)}
      </div>
      <div className="mt-5 flex items-end justify-between text-xs"><span className="text-muted">World restoration · {restoration.stage}</span><b className="text-fg">{Math.round(progress)}%</b></div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
      {pet && <div className="mt-4 rounded-2xl bg-surface-2/80 p-3 text-xs">
        <div className="flex items-center gap-2"><PawPrint className="size-4 text-gold" /><span className="text-muted">Companion:</span><b className="text-fg">{pet.name}</b><span className="ml-auto text-accent">{petEvolutionName(petProgress.level)}</span></div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted"><span>Pet XP · Lv. {petProgress.level}</span><span>{petProgress.next == null ? "MAX" : `${petProgress.next - (petProgress.current + (petXpFor(save.equippedPet, save) - petProgress.current))} to evolve`}</span></div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${petProgress.percent}%` }} /></div>
      </div>}
    </section>
  );
}

export function GameplayFeedback({ combo, found, total }: { combo: number; found: number; total: number }) {
  const multiplier = combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
  const remaining = Math.max(0, total - found);
  return <div className="gameplay-hud">
    <div className="hud-chip text-fg"><Zap className="size-3.5 text-gold" /> Combo {combo}</div>
    {multiplier > 1 && <div className="combo-burst">x{multiplier}</div>}
    <div className="hud-chip text-fg"><Trophy className="size-3.5 text-accent" /> {remaining} left</div>
  </div>;
}
