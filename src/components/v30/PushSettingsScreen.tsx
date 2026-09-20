import { useEffect, useState } from "react";
import { Screen } from "@/components/screens/chrome";
import { disablePushNotifications, enablePushNotifications, pushState } from "@/lib/v30/push/client";
import { useGame } from "@/lib/store";

export function PushSettingsScreen() {
  const user = useGame((s) => s.save.playerName);
  const [state, setState] = useState<"loading" | "enabled" | "disabled" | "unsupported">("loading");
  const [message, setMessage] = useState("");
  useEffect(() => { void pushState().then(setState); }, []);
  const run = async (fn: () => Promise<{ ok: boolean; message: string }>, next: "enabled" | "disabled") => {
    const result = await fn();
    setMessage(result.message);
    if (result.ok) setState(next);
  };
  return <Screen title="Push Notifications">
    <div className="flex flex-col gap-3">
      <section className="panel rounded-2xl p-4" aria-live="polite">
        <p className="text-xs uppercase tracking-wider text-gold">Delivery status</p>
        <p className="mt-1 font-display text-xl text-fg">{state === "enabled" ? "Enabled" : state === "unsupported" ? "Unsupported" : state === "loading" ? "Checking…" : "Not enabled"}</p>
        <p className="mt-2 text-sm text-muted">{user ? "Push subscriptions are scoped to your signed-in account." : "Sign in to save a push subscription to the server."}</p>
      </section>
      <button type="button" className="btn-primary" disabled={!user || state === "enabled" || state === "unsupported"} onClick={() => void run(enablePushNotifications, "enabled")}>Enable push</button>
      <button type="button" className="btn-ghost" disabled={state !== "enabled"} onClick={() => void run(disablePushNotifications, "disabled")}>Disable push</button>
      {message && <p className="text-sm text-muted" role="status">{message}</p>}
      <p className="text-xs text-muted">A deployment must provide a public VAPID key and a server-side push sender before notifications can be delivered while the app is closed.</p>
    </div>
  </Screen>;
}
