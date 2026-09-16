import { useEffect, useState } from "react";
import {
  acceptLegalConsent,
  getLegalConsent,
} from "@/lib/legal/consent";

export function AgreementGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    void getLegalConsent()
      .then((result) => {
        if (!alive) return;
        setAccepted(result.accepted);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Could not load agreement");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  async function accept() {
    setBusy(true);
    setError("");

    try {
      await acceptLegalConsent();
      setAccepted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save agreement");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="app-shell starfield safe-pad grid min-h-dvh place-items-center p-6">
        <p className="text-sm text-muted">Checking agreement…</p>
      </main>
    );
  }

  if (accepted) return <>{children}</>;

  return (
    <main className="app-shell starfield safe-pad grid min-h-dvh place-items-center p-6">
      <section className="panel w-full max-w-lg rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          Before you begin
        </p>

        <h1 className="font-display mt-2 text-2xl text-fg">
          Terms & Privacy Agreement
        </h1>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
          <p>
            By continuing, you agree to the Terms of Travel and acknowledge the
            Privacy Notice for Mera Word Search Journey.
          </p>

          <p>
            Your account may be used to store your game progress, display name,
            leaderboard results, and other features associated with your
            account.
          </p>

          <p>
            You can review the full legal information later from More → Help &
            Legal.
          </p>
        </div>

        {error && (
          <p className="mt-4 text-sm text-danger">{error}</p>
        )}

        <button
          type="button"
          className="btn-primary mt-6 w-full"
          onClick={() => void accept()}
          disabled={busy}
        >
          {busy ? "Saving…" : "I Agree & Continue"}
        </button>
      </section>
    </main>
  );
}
