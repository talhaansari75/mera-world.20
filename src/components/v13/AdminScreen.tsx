import { useEffect, useState } from "react";
import { ShieldCheck, Users, Gamepad2, Flag, Puzzle, RefreshCw } from "lucide-react";
import { getAdminDashboard } from "@/lib/server/admin";
import { Screen } from "@/components/screens/chrome";

type Dashboard = {
  ok: true;
  adminEmail: string;
  users: number;
  sessions: number;
  reports: number;
  puzzles: number;
};

export function AdminScreen({ onBack }: { onBack?: () => void }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const result = await getAdminDashboard();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <Screen title="Admin Control">
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="hud-chip text-fg"
        >
          ← Back
        </button>

        <section className="panel rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-primary/15">
              <ShieldCheck className="size-6 text-primary" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-fg">Administrator</h2>
              <p className="text-sm text-muted">
                Server-side admin authorization is active.
              </p>
            </div>
          </div>
          {data && (
            <p className="mt-4 break-all text-xs text-muted">
              Admin account: {data.adminEmail || "configured in Vercel"}
            </p>
          )}
        </section>

        {loading && (
          <section className="panel rounded-2xl p-5 text-sm text-muted">
            Loading dashboard…
          </section>
        )}

        {error && (
          <section className="panel rounded-2xl p-5">
            <p className="text-sm text-danger">{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="hud-chip mt-3 flex items-center gap-2 text-fg"
            >
              <RefreshCw className="size-4" /> Retry
            </button>
          </section>
        )}

        {data && (
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={<Users className="size-5" />} label="Users" value={data.users} />
            <Stat icon={<Gamepad2 className="size-5" />} label="Game Sessions" value={data.sessions} />
            <Stat icon={<Flag className="size-5" />} label="Reports" value={data.reports} />
            <Stat icon={<Puzzle className="size-5" />} label="Creator Puzzles" value={data.puzzles} />
          </div>
        )}
      </div>
    </Screen>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <section className="panel rounded-2xl p-4">
      <div className="mb-2 text-primary">{icon}</div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-fg">{value}</p>
    </section>
  );
}

export default AdminScreen;
