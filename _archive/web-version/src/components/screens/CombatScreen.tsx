import { useGame } from "@/lib/store";
import { Screen } from "./chrome";
import { isJourneyBoss } from "@/lib/game/journeyWorlds";

export function CombatScreen() {
  const combat = useGame((s) => s.combat);
  const action = useGame((s) => s.combatAction);
  const clear = useGame((s) => s.clearCombat);
  if (!combat) {
    return <Screen title="Boss Battle"><div className="panel rounded-2xl p-5 text-muted">No active guardian. Clear a boss level first.</div><button type="button" className="btn-primary mt-4" onClick={() => { const u = useGame.getState().save.unlockedLevel; let n = u; while (n > 1 && !isJourneyBoss(n)) n--; useGame.getState().startBossCombat(n); }}>Challenge the nearest guardian</button></Screen>;
  }
  const enemy = combat.enemy;
  return (
    <Screen title={enemy.name}>
      <div className="panel rounded-2xl p-5">
        <div className="flex justify-between font-semibold text-fg"><span>{enemy.title}</span><span className="tabular-nums">Phase {enemy.phase} · Turn {combat.turn}</span></div>
        <div className="mt-3 text-xs uppercase tracking-[0.16em] text-gold">{enemy.phase === 1 ? "Awakened" : enemy.phase === 2 ? "Enraged" : "Final Stand"}</div>
        <div className="mt-4 text-sm text-muted">Boss HP {enemy.hp} / {enemy.maxHp}</div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-danger" style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }} /></div>
        <div className="mt-5 text-sm text-muted">Your HP {combat.playerHp} / {combat.maxPlayerHp}</div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-success" style={{ width: `${Math.max(0, (combat.playerHp / combat.maxPlayerHp) * 100)}%` }} /></div>
        <div className="mt-4 rounded-xl bg-surface-2/60 p-3 text-sm text-muted">{combat.lastEvent}</div>
        {combat.victory && <div className="mt-5 font-semibold text-success">Victory! +{enemy.reward} coins</div>}
        {combat.defeated && <div className="mt-5 font-semibold text-danger">Defeated. Try again.</div>}
        {!combat.victory && !combat.defeated && <div className="mt-5 grid grid-cols-3 gap-2"><button type="button" className="hud-chip text-fg" onClick={() => action("word", true)}>Word</button><button type="button" className="hud-chip text-fg" onClick={() => action("power")}>Power</button><button type="button" className="hud-chip text-fg" onClick={() => action("guard")}>Guard</button></div>}
        {(combat.victory || combat.defeated) && <button type="button" className="btn-primary mt-4" onClick={clear}>Return</button>}
      </div>
    </Screen>
  );
}
