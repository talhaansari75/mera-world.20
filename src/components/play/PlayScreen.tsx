import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Lightbulb, Pause, Sparkles } from "lucide-react";
import { useGame } from "@/lib/store";
import { t } from "@/lib/game/i18n";
import { HINT_COST } from "@/lib/game/constants";
import { GridBoard } from "./GridBoard";
import { askSmartHint } from "@/lib/server/ai";

import { startGameplaySession, verifyGameplayCompletion } from "@/lib/server/gameplay";
import { todayKey, puzzleForLevel } from "@/lib/game/levels";
import { MAX_LEVEL } from "@/lib/game/constants";
import { journeyWorldForLevel, isJourneyBoss } from "@/lib/game/journeyWorlds";
import { adaptivePlan, nextChallengePreview, petEvolutionName, petXpEarned, petXpFor, petXpProgress, shortTermGoals } from "@/lib/game/engagement";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { DAILY_QUESTS, POWER_UPS, questProgress, xpIntoLevel, type PowerUpId } from "@/lib/game/liveSystems";

import { showH5Interstitial } from "@/lib/ads/h5GamesAds";
import { useAdFree } from "@/lib/ads/useAdFree";
import { GameplayFeedback } from "@/components/screens/JourneyPolish";

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function PlayScreen() {
  const play = useGame((s) => s.play);
  const save = useGame((s) => s.save);
  const overlay = useGame((s) => s.overlay);
  const lastReward = useGame((s) => s.lastReward);
  const lang = save.language;
  const user = useCurrentUser();
  const [tick, setTick] = useState(0);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [powerCooldowns, setPowerCooldowns] = useState<Record<string, number>>({});
  const [showSystems, setShowSystems] = useState(false);
  const [feedbackKey, setFeedbackKey] = useState(0);
  useEffect(() => { if (play?.found.length) setFeedbackKey((n) => n + 1); }, [play?.found.length]);
  const adFree = useAdFree();

  useEffect(() => {
    if (!play || !user || play.serverSessionId) return;
    void startGameplaySession({ data: { kind: play.kind === "daily" ? "daily" : "level", level: play.level || 1, day: play.kind === "daily" ? todayKey() : undefined, mode: play.mode, language: save.language, dailyChallengeId: play.dailyChallenge?.id } })
      .then((res) => {
        if (res.ok && useGame.getState().play?.serverSessionId == null) {
          const current = useGame.getState().play;
          if (current) {
            const next = {
              ...current,
              serverSessionId: res.sessionId,
              timeLimit: Math.floor(res.timeLimitMs / 1000),
              adaptiveTier: res.adaptiveTier ?? current.adaptiveTier,
            };
            sessionStorage.setItem("mwsj.play.v1", JSON.stringify(next));
            useGame.setState({ play: next });
          }
        }
      }).catch(() => undefined);
  }, [play?.serverSessionId, play?.level, play?.kind, play?.mode, save.language, user]);

  useEffect(() => {
    if (!play || play.pausedAt || overlay) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [play, overlay, play?.pausedAt]);

  const elapsed = play ? (play.pausedAt ? play.pausedAt : Date.now()) - play.startAt - play.pausedMs : 0;
  const remaining = play?.timeLimit != null ? play.timeLimit * 1000 - elapsed : null;

  useEffect(() => {
    if (remaining != null && remaining <= 0 && play && !overlay) useGame.getState().failPlay();
  }, [remaining, play, overlay, tick]);

  const remainingWords = useMemo(() => {
    if (!play) return [];
    return play.puzzle.words.filter((w) => !play.found.includes(w));
  }, [play]);

  if (!play) return null;

  const fog = play.mode === "fog" || play.dailyChallenge?.id === "hidden";
  const mirror = play.mode === "mirror";

  const onAi = async () => {
    const w = remainingWords[0];
    if (!w || aiBusy) return;
    setAiBusy(true);
    try {
      const res = await askSmartHint({ data: { word: w, category: play.puzzle.category } });
      setAiHint(res.ok ? res.text : res.error);
    } catch {
      setAiHint("Sign in to ask the scribe for a riddle.");
    } finally {
      setAiBusy(false);
    }
  };

  const usePowerUp = (id: PowerUpId) => {
    const power = POWER_UPS.find((p) => p.id === id);
    if (!power) return;
    const now = Date.now();
    if ((powerCooldowns[id] ?? 0) > now) return;
    if (save.coins < power.cost) return;

    if (id === "reveal") {
      const ok = useGame.getState().useHint("first");
      if (!ok) return;
    } else if (id === "scan") {
      const ok = useGame.getState().useHint("word");
      if (!ok) return;
    } else if (id === "focus") {
      useGame.getState().patchSave((x: any) => ({
        ...x,
        coins: x.coins - power.cost,
        stats: { ...x.stats, coinsEarned: x.stats.coinsEarned },
      }));
    } else {
      useGame.getState().patchSave((x: any) => ({
        ...x,
        coins: x.coins - power.cost,
        inventory: x.inventory.includes("streak-shield") ? x.inventory : [...x.inventory, "streak-shield"],
      }));
    }

    setPowerCooldowns((x) => ({ ...x, [id]: power.cooldownMs ? now + power.cooldownMs : now + 800 }));
  };

  const xpBar = xpIntoLevel(save.xp);
  const questCards = DAILY_QUESTS.map((q) => ({
    ...q,
    progress: questProgress(q, save.stats),
  }));

  return (
    <div className="app-shell safe-pad flex h-dvh min-h-0 flex-col gap-1 overflow-hidden sm:gap-2">
      <header className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl panel"
          onClick={() => useGame.getState().pausePlay()}
          aria-label={t(lang, "cta.pause")}
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm text-fg">{play.puzzle.title}</p>
          <p className="text-xs text-muted">
            {play.found.length}/{play.puzzle.words.length}
            {play.bonus.length ? ` · +${play.bonus.length}` : ""}
          </p>
        </div>
        {save.settings.showTimer && (
          <div className="hud-chip text-fg">
            {remaining != null ? fmt(remaining) : fmt(elapsed)}
          </div>
        )}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl panel"
          onClick={() => useGame.getState().pausePlay()}
          aria-label={t(lang, "cta.pause")}
        >
          <Pause className="size-4" />
        </button>
      </header>

      <GameplayFeedback combo={play.combo} found={play.found.length} total={play.puzzle.words.length} />
      <GoalStrip goals={shortTermGoals({ level: play.level || 1, combo: play.combo, found: play.found.length, total: play.puzzle.words.length, bonus: play.bonus.length, daily: play.kind === "daily", adaptiveTier: play.adaptiveTier })} />
      {play.dailyChallenge && <div className="mx-auto w-full max-w-xl rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-fg"><b>{play.dailyChallenge.icon} {play.dailyChallenge.title}</b><span className="ml-2 text-muted">{play.dailyChallenge.description}</span></div>}
      {play.kind === "level" && play.adaptiveTier === "assist" && <div className="mx-auto w-full max-w-xl rounded-xl bg-accent/10 px-3 py-1.5 text-center text-[10px] font-semibold text-accent">Smart Assist · the journey is giving you a little breathing room</div>}
      {play.kind === "level" && play.adaptiveTier === "expert" && <div className="mx-auto w-full max-w-xl rounded-xl bg-gold/10 px-3 py-1.5 text-center text-[10px] font-semibold text-gold">Expert Pace · bonus-word mastery challenge active</div>}

      <div key={feedbackKey} className="grid min-h-0 flex-1 place-items-center overflow-hidden gameplay-board-pop">
        <GridBoard
          puzzle={play.puzzle}
          found={play.found}
          revealed={play.revealed}
          fog={fog}
          mirror={mirror}
          tileStyle={save.settings.tileStyle}
          disabled={Boolean(overlay)}
          onPath={(letters, cells) => useGame.getState().submitPath(letters, cells)}
        />
      </div>

      <div className="flex max-h-20 shrink-0 flex-wrap gap-1.5 overflow-y-auto py-1 sm:max-h-28">
        {play.puzzle.words.map((w) => (
          <span key={w} className="word-chip text-fg" data-found={play.found.includes(w) ? "1" : undefined}>
            {mirror ? [...w].reverse().join("") : w}
          </span>
        ))}
      </div>


      <button
        type="button"
        className="panel rounded-xl px-3 py-2 text-left text-xs font-semibold text-fg"
        onClick={() => setShowSystems((v) => !v)}
      >
        Power-ups · Daily quests · Rank {xpBar.level}
      </button>

      {showSystems && (
        <div className="panel rounded-2xl p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">Power-ups</span>
            <span className="text-[10px] text-muted tabular-nums">
              {xpBar.current}/{xpBar.needed} xp
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {POWER_UPS.map((p) => {
              const locked = (powerCooldowns[p.id] ?? 0) > Date.now();
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={locked || save.coins < p.cost}
                  onClick={() => usePowerUp(p.id)}
                  className="rounded-xl border border-border px-1 py-2 text-center text-[10px] font-semibold text-fg disabled:opacity-40"
                  title={p.description}
                >
                  <div>{p.name}</div>
                  <div className="text-gold">{p.cost}c</div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wider text-gold">Daily quests</div>
          <div className="space-y-1.5">
            {questCards.map((q) => (
              <div key={q.id} className="rounded-lg bg-surface-2 px-2 py-1.5">
                <div className="flex justify-between text-[11px] text-fg">
                  <span>{q.title}</span>
                  <span className="tabular-nums">
                    {q.progress}/{q.target}
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(q.progress / q.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiHint && <p className="text-center text-sm text-muted">{aiHint}</p>}

      <div className="flex shrink-0 gap-2 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <HintBtn label="First" cost={HINT_COST.first} onClick={() => useGame.getState().useHint("first")} />
        <HintBtn label="Letter" cost={HINT_COST.letter} onClick={() => useGame.getState().useHint("letter")} />
        <HintBtn label="Word" cost={HINT_COST.word} onClick={() => useGame.getState().useHint("word")} />
        <button
          type="button"
          onClick={() => void onAi()}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1 rounded-xl panel text-xs font-semibold text-fg"
        >
          <Sparkles className="size-3.5" />
          {aiBusy ? "…" : "Riddle"}
        </button>
      </div>

      {overlay === "pause" && <PauseModal lang={lang} />}
      {overlay === "win" && lastReward && <WinModal lang={lang} playKind={play.kind} level={play.level} reward={lastReward} adFree={adFree} save={save} />}
      {overlay === "fail" && <FailModal lang={lang} />}
    </div>
  );
}

function GoalStrip({ goals }: { goals: Array<{ id: string; label: string; done: boolean }> }) {
  return (
    <div className="mx-auto flex w-full max-w-xl shrink-0 gap-1.5 overflow-x-auto pb-0.5" aria-label="Short term goals">
      {goals.map((goal) => (
        <div key={goal.id} className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${goal.done ? "border-success/40 bg-success/10 text-success" : "border-white/10 bg-surface-2 text-muted"}`}>
          {goal.done ? "✓" : "○"} {goal.label}
        </div>
      ))}
    </div>
  );
}

function HintBtn({ label, cost, onClick }: { label: string; cost: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 flex-1 flex-col items-center justify-center rounded-xl panel text-fg"
    >
      <span className="inline-flex items-center gap-1 text-xs font-semibold">
        <Lightbulb className="size-3.5" />
        {label}
      </span>
      <span className="text-[10px] text-gold">{cost}</span>
    </button>
  );
}

function PauseModal({ lang }: { lang: ReturnType<typeof useGame.getState>["save"]["language"] }) {
  return (
    <Modal>
      <h2 className="font-display text-2xl text-fg">{t(lang, "play.paused")}</h2>
      <div className="mt-4 flex flex-col gap-2">
        <button type="button" className="btn-primary" onClick={() => useGame.getState().resumePlay()}>
          {t(lang, "cta.resume")}
        </button>
        <button type="button" className="btn-ghost" onClick={() => useGame.getState().quitPlay()}>
          {t(lang, "cta.quit")}
        </button>
      </div>
    </Modal>
  );
}

function WinModal({
  lang,
  playKind,
  level,
  reward,
  adFree,
  save,
}: {
  lang: ReturnType<typeof useGame.getState>["save"]["language"];
  playKind: "level" | "daily" | "endless";
  level: number;
  reward: { coins: number; xp: number; stars: number; title: string };
  adFree: boolean;
  save: ReturnType<typeof useGame.getState>["save"];
}) {
  const petXp = petXpFor(save.equippedPet, save);
  const result = playKind === "level" ? save.results[String(level)] : null;
  const earnedPetXp = save.equippedPet ? petXpEarned({ perfect: Boolean(result?.perfect), boss: playKind === "level" && level > 0 && isJourneyBoss(level) }) : 0;
  const petProgress = petXpProgress(petXp);
  const isFinal = level >= MAX_LEVEL;
  const next = !isFinal && playKind === "level" ? puzzleForLevel(level + 1, "classic", save.language) : null;
  const preview = next ? nextChallengePreview(level + 1, next) : null;
  const world = journeyWorldForLevel(level);
  return (
    <Modal>
      <p className="text-xs uppercase tracking-[0.18em] text-gold">{reward.title}</p>
      <h2 className="mt-1 font-display text-3xl text-fg">{t(lang, "play.complete")}</h2>
      <div className="celebration-fireworks" aria-hidden="true"><i /><i /><i /><i /><i /></div><p className="mt-3 text-lg text-gold">{"★".repeat(reward.stars)}{"☆".repeat(3 - reward.stars)}</p>
      <p className="mt-2 text-sm text-muted">+{reward.coins} coins · +{reward.xp} xp</p>
      {save.equippedPet && <div className="mt-3 rounded-2xl bg-surface-2 p-3 text-left text-xs">
        <div className="flex items-center justify-between"><span className="text-muted">🐾 Pet progress</span><b className="text-fg">{petEvolutionName(petProgress.level)} · Lv. {petProgress.level}</b></div>
        <div className="mt-1 text-muted">+{earnedPetXp} Pet XP · {petProgress.next == null ? "Evolution maxed" : `${Math.max(0, petProgress.next - petXp)} XP to next evolution`}</div>
      </div>}
      {preview && <div className="mt-3 rounded-2xl border border-white/10 bg-surface-2 p-3 text-left">
        <p className="text-[10px] uppercase tracking-[0.18em] text-accent">Next challenge</p>
        <p className="mt-1 text-sm font-semibold text-fg">{preview.icon} {preview.label}</p>
        <p className="mt-0.5 text-xs text-muted">Level {level + 1} · {preview.detail}</p>
      </div>}
      {isFinal && <div className="mt-3 rounded-2xl bg-gold/10 p-3 text-sm text-gold">🏆 {world.name} campaign complete. The final archive is restored.</div>}
      <div className="mt-5 flex flex-col gap-2">
        {playKind === "level" && level > 0 && isJourneyBoss(level) && <button type="button" className="btn-primary" onClick={() => useGame.getState().startBossCombat(level)}>Enter Guardian Battle</button>}
        {playKind === "level" && !isFinal && (
          <button type="button" className="btn-primary" onClick={() => {
            const nextLevel = () => useGame.getState().startLevel(level + 1);
            if (!adFree && showH5Interstitial("level-complete", nextLevel)) return;
            nextLevel();
          }}>
            {t(lang, "cta.next")}
          </button>
        )}
        {isFinal && <button type="button" className="btn-primary" onClick={() => useGame.getState().go("worldMap")}>Journey Map</button>}
        <button type="button" className="btn-ghost" onClick={() => useGame.getState().quitPlay()}>
          {t(lang, "cta.home")}
        </button>
      </div>
    </Modal>
  );
}

function FailModal({ lang }: { lang: ReturnType<typeof useGame.getState>["save"]["language"] }) {
  const play = useGame((s) => s.play);
  return (
    <Modal>
      <h2 className="font-display text-2xl text-fg">{t(lang, "play.failed")}</h2>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            if (!play) return;
            if (play.kind === "daily") useGame.getState().startDaily();
            else if (play.kind === "endless") useGame.getState().startEndless();
            else useGame.getState().startLevel(play.level, play.mode);
          }}
        >
          {t(lang, "cta.retry")}
        </button>
        <button type="button" className="btn-ghost" onClick={() => useGame.getState().quitPlay()}>
          {t(lang, "cta.home")}
        </button>
      </div>
    </Modal>
  );
}

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-bg/70 p-6 backdrop-blur-sm">
      <div className="panel animate-pop w-full max-w-sm rounded-2xl p-6 text-center">{children}</div>
    </div>
  );
}
