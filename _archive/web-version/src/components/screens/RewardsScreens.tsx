import { useGame } from "@/lib/store";
import { Screen } from "./chrome";
import { ACHIEVEMENTS, achievementProgress } from "@/lib/game/achievements";
import { MISSIONS, periodKey } from "@/lib/game/missions";

export function AchievementsScreen() {
  const save = useGame((s) => s.save);
  const claim = useGame((s) => s.claimAchievement);
  return (
    <Screen title="Achievements">
      <div className="grid gap-3">
        {ACHIEVEMENTS.map((a) => {
          const p = achievementProgress(a, save.stats);
          const c = save.claimedAchievements.includes(a.id);
          return (
            <div key={a.id} className="panel rounded-2xl p-4">
              <b className="text-fg">{a.title}</b>
              <p className="text-sm text-muted">{a.description}</p>
              <p className="text-xs text-muted">
                {p.value}/{a.target} · +{a.reward}c
              </p>
              {p.done && (
                <button className="hud-chip mt-2 text-fg" disabled={c} onClick={() => claim(a.id)}>
                  {c ? "Claimed" : "Claim reward"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

export function MissionsScreen() {
  const save = useGame((s) => s.save);
  const claim = useGame((s) => s.claimMission);
  return (
    <Screen title="Missions">
      <div className="grid gap-3">
        {MISSIONS.map((m) => {
          const k = m.metric === "levels" ? "levelsCompleted" : m.metric === "words" ? "wordsFound" : "coinsEarned";
          const v = Math.min(Number(save.stats[k] ?? 0), m.target);
          const ck = `${m.id}:${periodKey(m.period)}`;
          const done = v >= m.target;
          const c = save.claimedMissions.includes(ck);
          return (
            <div key={m.id} className="panel rounded-2xl p-4">
              <b className="text-fg">{m.title}</b>
              <p className="text-sm text-muted">{m.description}</p>
              <p className="text-xs text-muted">
                {v}/{m.target} · +{m.reward}c
              </p>
              {done && (
                <button className="hud-chip mt-2 text-fg" disabled={c} onClick={() => claim(m.id)}>
                  {c ? "Claimed" : "Claim reward"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
