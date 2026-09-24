import { Check, Lock, MapPin, Sparkles, Swords } from "lucide-react";
import { useGame } from "@/lib/store";
import { Screen } from "./chrome";
import { JOURNEY_WORLDS, chestClaimed, journeyWorldProgress } from "@/lib/game/journeyWorlds";
import { worldNodes } from "@/lib/game/worldStory";
import { worldRestoration } from "@/lib/game/engagement";

export function WorldMapScreen() {
  const save=useGame(s=>s.save); const maxUnlocked=Math.max(1,save.unlockedLevel??1); const nodes=worldNodes(maxUnlocked);
  return <Screen title="Journey Map">
    <div className="mb-4 rounded-3xl panel p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.22em] text-accent">The Great Word Journey</p><h2 className="mt-1 font-display text-2xl text-fg">6 worlds. One complete adventure.</h2><p className="mt-1 text-sm text-muted">Explore each realm, defeat its guardian, then open its completion chest.</p></div><MapPin className="mt-1 size-7 text-gold" /></div></div>
    <div className="relative grid gap-4">
      <div className="pointer-events-none absolute left-7 top-7 bottom-7 w-px bg-white/10" />
      {JOURNEY_WORLDS.map(w=>{const progress=journeyWorldProgress(save,w);const restoration=worldRestoration(save,w);const unlocked=maxUnlocked>=w.from;const defeated=Boolean(save.results[String(w.to)]);const opened=chestClaimed(save,w.world);const ns=nodes.filter(n=>n.chapter===`ch${w.world}`);const bossUnlocked=maxUnlocked>=w.to;return <section key={w.id} className={`relative rounded-3xl panel p-4 ${!unlocked?"opacity-55":""}`}>
        <div className="flex gap-3"><div className="z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 font-display text-xl text-gold">{defeated?<Check className="size-6"/>:w.world}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="text-xs uppercase tracking-[0.18em] text-accent">World {w.world}</p><h3 className="font-display text-xl text-fg">{w.name}</h3><p className="text-xs text-muted">{w.subtitle}</p></div>{!unlocked&&<Lock className="size-5 text-muted"/>}</div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-primary transition-all" style={{width:`${progress}%`}}/></div><div className="mt-1 flex justify-between text-[11px] text-muted"><span>{progress}% explored · {restoration.stage}</span><span>Lv {w.from}–{w.to}</span></div></div></div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{w.story}</p><div className="mt-3 flex flex-wrap gap-1.5">{w.mechanics.map(m=><span key={m} className="hud-chip text-[10px] text-fg">{m}</span>)}</div>
        <div className="mt-4 grid grid-cols-5 gap-1.5">{ns.map(n=><button key={n.id} type="button" disabled={!n.unlocked} onClick={()=>n.unlocked&&useGame.getState().startLevel(n.level)} className={`relative aspect-square rounded-xl p-1 text-center text-xs ${n.unlocked?"panel text-fg":"bg-white/5 text-muted"}`}>{n.unlocked?(n.boss?<Swords className="mx-auto size-4 text-gold"/>:<span className="font-bold">{n.level}</span>):<Lock className="mx-auto size-4"/>}<span className="block text-[9px] text-muted">{n.title}</span></button>)}</div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-3"><div className="flex items-center gap-2"><Swords className="size-4 text-gold"/><div><p className="text-xs uppercase tracking-[0.16em] text-gold">Boss Gate</p><p className="font-semibold text-fg">{w.boss}</p></div></div><p className="mt-1 text-xs text-muted">{w.bossTitle} · Level {w.to}</p><button type="button" disabled={!bossUnlocked} onClick={()=>useGame.getState().startLevel(w.to,"boss")} className="mt-3 w-full rounded-xl btn-primary disabled:opacity-40">{bossUnlocked?"Challenge Boss":`Reach Level ${w.to}`}</button></div>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 p-3"><div className="flex items-center gap-2"><Sparkles className="size-5 text-gold"/><div><p className="font-semibold text-fg">World Completion Chest</p><p className="text-xs text-muted">+{w.chestCoins} coins · +{w.chestDiamonds} diamonds</p></div></div><button type="button" disabled={!defeated||opened} onClick={()=>useGame.getState().claimWorldChest(w.world)} className="rounded-xl px-3 py-2 text-xs font-bold btn-primary disabled:opacity-40">{opened?"Opened":defeated?"Open":"Locked"}</button></div>
      </section>})}
    </div>
  </Screen>;
}
