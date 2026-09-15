import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || "Traveler" });
        if (res.error) throw new Error(res.error.message || "Sign up failed");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Sign in failed");
      }
      window.location.href = "/";
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="app-shell starfield safe-pad grid min-h-dvh place-items-center p-6">
      <div className="panel w-full max-w-sm rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Optional</p>
        <h1 className="font-display mt-1 text-2xl text-fg">Join the hall</h1>
        <p className="mt-2 text-sm text-muted">
          Cloud save and leaderboards. Guests keep every page locally — no forced login.
        </p>

        {authEnabled ? (
          <div className="mt-5 flex flex-col gap-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="btn-ghost"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Sign-in is disabled in this build.</p>
        )}

        {authEnabled && emailAndPasswordEnabled && (
          <form className="mt-5 flex flex-col gap-2" onSubmit={onEmail}>
            {mode === "up" && (
              <input
                className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
                placeholder="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="nickname"
              />
            )}
            <input
              type="email"
              required
              className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              type="password"
              required
              minLength={8}
              className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
              placeholder="Password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
            {err && <p className="text-sm text-danger">{err}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in with email"}
            </button>
            <button
              type="button"
              className="text-sm text-muted"
              onClick={() => setMode(mode === "up" ? "in" : "up")}
            >
              {mode === "up" ? "Have an account? Sign in" : "New traveler? Create account"}
            </button>
          </form>
        )}

        <Link to="/" className="btn-ghost mt-5">
          Continue as guest
        </Link>
      </div>
    </main>
  );
}
