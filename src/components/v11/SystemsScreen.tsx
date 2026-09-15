import { useMemo, useState } from "react";
import { Screen } from "@/components/screens/chrome";
import { getPlatformHealth } from "@/lib/v10/services/platformHealth";
import { ULTIMATE_SETTINGS } from "@/lib/settings/ultimateSettings";
import { useGame } from "@/lib/store";
export function SystemsScreen() {
  const save = useGame((s) => s.save); const [query, setQuery] = useState("");
  const health = useMemo(() => getPlatformHealth(), []);
  const settings = useMemo(() => { const q=query.trim().toLowerCase(); return ULTIMATE_SETTINGS.filter(x=>!q||x.id.toLowerCase().includes(q)||x.category.toLowerCase().includes(q)).slice(0,30); }, [query]);
  const ready=health.filter(x=>x.status==="ready").length;
  return <Screen title="Systems & Diagnostics">
    <div className="panel rounded-2xl p-4"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-muted">Platform health</p><p className="font-display text-2xl text-fg">{ready}/{health.length} ready</p></div><span className="hud-chip text-fg">Local-first</span></div>
      <div className="mt-4 flex flex-col gap-2">{health.map(h=><div key={h.id} className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2 text-sm"><span className="text-fg">{h.label}</span><span className="text-muted">{h.status}</span></div>)}</div>
    </div>
    <div className="panel mt-4 rounded-2xl p-4"><p className="text-xs uppercase tracking-wider text-muted">Save diagnostics</p><div className="mt-2 grid grid-cols-2 gap-2 text-sm">
      {[["Level",save.unlockedLevel],["XP",save.xp],["Coins",save.coins],["Words",save.stats.wordsFound]].map(([k,v])=><div key={String(k)} className="rounded-xl bg-surface-2 p-3"><span className="text-muted">{k}</span><p className="font-semibold text-fg">{v}</p></div>)}
    </div></div>
    <div className="panel mt-4 rounded-2xl p-4"><p className="text-xs uppercase tracking-wider text-muted">485-setting registry</p><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search settings or category" className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg" />
      <div className="mt-3 grid grid-cols-1 gap-2">{settings.map(x=><div key={x.id} className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2 text-sm"><span className="text-fg">{x.id}</span><span className="text-muted">{x.category} · {x.type}</span></div>)}</div>
      {!settings.length&&<p className="mt-3 text-sm text-muted">No matching registry entries.</p>}
    </div><p className="mt-3 text-xs text-muted">Cloud, payments, push and multiplayer remain configuration-dependent; this screen reports current local status.</p>
  </Screen>;
}
