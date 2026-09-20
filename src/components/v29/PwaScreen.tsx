import { useEffect, useState } from "react";
import { Screen } from "@/components/screens/chrome";
import { applyPwaUpdate, canInstallPwa, hasWaitingUpdate, installPwa, pwaStatus } from "@/lib/v29/pwa/pwa";

export function PwaScreen() {
  const [status, setStatus] = useState(pwaStatus());
  const refresh = () => setStatus(pwaStatus());
  useEffect(() => {
    window.addEventListener("online", refresh); window.addEventListener("offline", refresh);
    const id = window.setInterval(refresh, 1500);
    return () => { window.removeEventListener("online", refresh); window.removeEventListener("offline", refresh); window.clearInterval(id); };
  }, []);
  const install = async () => { await installPwa(); refresh(); };
  const update = () => { applyPwaUpdate(); window.setTimeout(() => window.location.reload(), 250); };
  return <Screen title="Offline & Install">
    <div className="flex flex-col gap-3">
      <section className="panel rounded-2xl p-4" aria-live="polite">
        <p className="text-xs uppercase tracking-wider text-gold">PWA status</p>
        <p className="mt-1 font-display text-xl text-fg">{status.online ? "Online" : "Offline mode"}</p>
        <p className="mt-2 text-sm text-muted">Core game data stays local-first. Network-backed features reconnect when service is restored.</p>
      </section>
      {canInstallPwa() && <button type="button" className="btn-primary" onClick={install}>Install app</button>}
      {hasWaitingUpdate() && <button type="button" className="btn-primary" onClick={update}>Apply available update</button>}
      <section className="panel rounded-2xl p-4">
        <p className="font-semibold text-fg">Accessibility keyboard mode</p>
        <p className="mt-1 text-sm text-muted">On the puzzle board, focus the grid and use arrow keys to move. Enter selects the first cell and Enter again submits the line.</p>
        <p className="mt-2 text-xs text-muted">Installed: {status.installed ? "yes" : "not yet"} · Update: {status.updateAvailable ? "ready" : "none"}</p>
      </section>
    </div>
  </Screen>;
}
