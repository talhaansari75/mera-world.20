import { useEffect, useState } from "react";
import { Screen } from "@/components/screens/chrome";
import { getAdminSnapshot } from "@/lib/v13/admin/server";

export function AdminScreen({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminSnapshot>> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void getAdminSnapshot().then(setData).catch((e) => setError(e?.message || "Admin access unavailable")); }, []);
  return <Screen title="Admin Control" onBack={onBack}>
    {error ? <div className="panel rounded-2xl p-4 text-sm text-muted">{error}</div> : !data ? <p className="text-muted">Loading protected metrics…</p> :
      <div className="grid grid-cols-2 gap-2">{[
        ["Users seen", data.usersSeen], ["Events / 24h", data.events24h], ["Open rooms", data.openRooms], ["Open reports", data.openReports], ["Verified purchases", data.verifiedPurchases], ["Entitlements", data.activeEntitlements]
      ].map(([k,v]) => <div key={String(k)} className="panel rounded-2xl p-4"><p className="text-xs text-muted">{k}</p><p className="mt-1 font-display text-2xl text-fg">{v}</p></div>)}</div>}
    <p className="mt-4 text-xs text-muted">Admin access is enforced server-side with ADMIN_USER_IDS. No admin secret is shipped to the client.</p>
  </Screen>;
}
