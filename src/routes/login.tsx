import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email: identifier,
          password,
          name: name || "Traveler",
          username: username,
          displayUsername: username,
        });
        if (res.error) throw new Error(res.error.message || "Sign up failed");
      } else {
        const res = identifier.includes("@")
          ? await authClient.signIn.email({ email: identifier, password })
          : await authClient.signIn.username({ username: identifier, password });
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
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Required</p>
        <h1 className="font-display mt-1 text-2xl text-fg">Join the hall</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in or create an account to continue your journey.
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
              <>
                <input
                  required
                  minLength={3}
                  maxLength={30}
                  className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
                <input
                  className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
                  placeholder="Display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="nickname"
                />
              </>
            )}
            <input
              type={mode === "up" ? "email" : "text"}
              required
              className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
              placeholder={mode === "up" ? "Email" : "Username or Email"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete={mode === "up" ? "email" : "username"}
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
              {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
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

      </div>
    </main>
  );
}
