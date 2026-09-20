import { useMemo } from "react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { buildAdaptiveProfile } from "@/lib/v32/adaptive/difficulty";
export function AdaptiveScreen(){
 const stats=useGame(s=>s.save.stats), unlocked=useGame(s=>s.save.unlockedLevel), go=useGame.getState().go;
 const p=useMemo(()=>buildAdaptiveProfile(stats,unlocked),[stats,unlocked]);
 return <Screen title="Adaptive Challenge"><div className="flex flex-col gap-4">
  <section className="panel rounded-2xl p-4"><p className="text-xs uppercase tracking-wider text-primary">Local adaptive engine</p><h2 className="font-display mt-1 text-2xl text-fg">Challenge score: {p.score}/100</h2><p className="mt-2 text-sm text-muted">{p.reason}</p></section>
  <section className="panel rounded-2xl p-4"><div className="flex items-center justify-between"><span className="text-muted">Current band</span><strong className="capitalize text-fg">{p.band}</strong></div><div className="mt-3 flex items-center justify-between"><span className="text-muted">Suggested level</span><strong className="text-fg">{p.recommendedLevel}</strong></div></section>
  <section><h3 className="mb-2 font-semibold text-fg">Recommended training</h3><div className="grid gap-2 sm:grid-cols-3">{p.recommendedModes.map(m=><button key={m} className="panel rounded-xl p-3 text-left text-fg" onClick={()=>go("modes")}>{m.replaceAll("_"," ")}</button>)}</div></section>
 </div></Screen>
}
