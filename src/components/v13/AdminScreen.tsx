import { useEffect, useState } from "react";
import { Activity, Clock3, Gamepad2, Mail, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { getAdminDashboard } from "@/lib/server/admin";
import { Screen } from "@/components/screens/chrome";

type Player = {
  player_number: number;
  user_id: string;
  name: string;
  email: string;
  username: string;
  created_at: string;
  last_seen_at: string;
  total_play_seconds: number;
  current_screen: string;
};

type ActivityRow = {
  id: number;
  player_number: number;
  name: string;
  username: string;
  email: string;
  event_type: string;
  screen: string | null;
  occurred_at: string;
  duration_seconds: number;
};

type Dashboard = {
  ok: true;
  adminEmail: string;
  summary: { users: number; activities: number; recent_activities: number; active_now: number };
  players: Player[];
  activity: ActivityRow[];
};

function duration(total: number) {
  const seconds = Math.max(0, Number(total) || 0);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h ? `${h}h ${m}m` : m ? `${m}m ${s}s` : `${s}s`;
}

function when(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export function AdminScreen({ onBack }: { onBack?: () => void }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setData(await getAdminDashboard() as Dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <Screen title="Admin Control" onBack={onBack}>
      <div className="mx-auto w-full max-w-6xl space-y-4 pb-10">
        <section className="panel rounded-2xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/15"><ShieldCheck className="size-6 text-primary" /></span>
              <div>
                <h2 className="text-lg font-bold text-fg">Administrator Dashboard</h2>
                <p className="text-xs text-muted">Player identity, presence, play time and recent activity.</p>
              </div>
            </div>
            <button type="button" onClick={() => void load()} className="hud-chip flex items-center gap-2 text-fg" disabled={loading}>
              <RefreshCw className="size-4" /> Refresh
            </button>
          </div>
        </section>

        {loading && <section className="panel rounded-2xl p-5 text-sm text-muted">Loading dashboard…</section>}
        {error && <section className="panel rounded-2xl p-5 text-sm text-danger">{error}</section>}

        {data && (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric icon={<Users />} label="Players" value={Number(data.summary.users) || 0} />
              <Metric icon={<Activity />} label="Active now" value={Number(data.summary.active_now) || 0} />
              <Metric icon={<Gamepad2 />} label="Activity events" value={Number(data.summary.activities) || 0} />
              <Metric icon={<Clock3 />} label="Last 24h events" value={Number(data.summary.recent_activities) || 0} />
            </div>

            <section className="panel overflow-hidden rounded-2xl">
              <div className="border-b border-border p-4">
                <h3 className="font-bold text-fg">Players</h3>
                <p className="text-xs text-muted">Automatic player number, account identity and total tracked play time.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-surface-2 text-xs text-muted">
                    <tr>
                      <th className="px-3 py-3">#</th><th className="px-3 py-3">Name</th><th className="px-3 py-3">Username</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Play time</th><th className="px-3 py-3">Current</th><th className="px-3 py-3">Last seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.players.map((p) => {
                      const online = Date.now() - new Date(p.last_seen_at).getTime() < 120000;
                      return (
                        <tr key={p.user_id} className="border-t border-border">
                          <td className="px-3 py-3 font-bold text-primary">{p.player_number}</td>
                          <td className="px-3 py-3 text-fg">{p.name || "—"}</td>
                          <td className="px-3 py-3 text-fg">@{p.username || "—"}</td>
                          <td className="px-3 py-3 text-muted">{p.email}</td>
                          <td className="px-3 py-3 font-semibold text-fg">{duration(Number(p.total_play_seconds))}</td>
                          <td className="px-3 py-3">{online ? <span className="text-emerald-400">● Playing</span> : <span className="text-muted">{p.current_screen || "Offline"}</span>}</td>
                          <td className="px-3 py-3 text-xs text-muted">{when(p.last_seen_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel overflow-hidden rounded-2xl">
              <div className="border-b border-border p-4">
                <h3 className="font-bold text-fg">Recent Player Activity</h3>
                <p className="text-xs text-muted">Latest heartbeat and navigation events from signed-in players.</p>
              </div>
              <div className="max-h-[360px] overflow-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="sticky top-0 bg-surface-2 text-xs text-muted">
                    <tr><th className="px-3 py-3">Player</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Event</th><th className="px-3 py-3">Screen</th><th className="px-3 py-3">Time</th><th className="px-3 py-3">Duration</th></tr>
                  </thead>
                  <tbody>
                    {data.activity.map((a) => (
                      <tr key={a.id} className="border-t border-border">
                        <td className="px-3 py-3 text-fg">#{a.player_number} {a.name} <span className="text-muted">@{a.username}</span></td>
                        <td className="px-3 py-3 text-muted"><span className="inline-flex items-center gap-1"><Mail className="size-3" />{a.email}</span></td>
                        <td className="px-3 py-3 text-fg">{a.event_type}</td>
                        <td className="px-3 py-3 text-muted">{a.screen || "—"}</td>
                        <td className="px-3 py-3 text-xs text-muted">{when(a.occurred_at)}</td>
                        <td className="px-3 py-3 text-fg">{duration(Number(a.duration_seconds))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </Screen>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <section className="panel rounded-2xl p-4"><div className="mb-2 size-5 text-primary">{icon}</div><p className="text-xs text-muted">{label}</p><p className="mt-1 text-2xl font-bold text-fg">{value}</p></section>;
}

export default AdminScreen;
