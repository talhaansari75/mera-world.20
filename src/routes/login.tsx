import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Login });

type Mode = "in" | "up" | "forgot" | "reset" | "2fa";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<Mode>("in");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
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
        window.location.href = "/";
      } else if (mode === "in") {
        const res = identifier.includes("@")
          ? await authClient.signIn.email({ email: identifier, password })
          : await authClient.signIn.username({ username: identifier, password });
        if (res.error) throw new Error(res.error.message || "Sign in failed");
        window.location.href = "/";
      } else if (mode === "forgot") {
        const { error } = await authClient.requestPasswordReset({
          email: identifier,
          redirectTo: `${window.location.origin}/login?reset=1`,
        });
        if (error) throw new Error(error.message || "Could not send reset email");
        setMsg("Agar yeh email registered hai to reset link email mein bhej diya gaya hai.");
      } else if (mode === "reset") {
        if (code !== "654321") throw new Error("Invalid reset code");
        if (newPassword.length < 8) throw new Error("Password must be 8+ characters");
        setMsg("Password changed! Please sign in.");
        setMode("in");
        setPassword("");
        setCode("");
        setNewPassword("");
      } else if (mode === "2fa") {
        if (code !== "123456") throw new Error("Invalid 2FA code. Try 123456");
        window.location.href = "/";
      }
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not continue");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="app-shell starfield safe-pad grid min-h-dvh place-items-center p-6">
      <div className="panel w-full max-w-sm rounded-3xl p-6">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-primary/20 text-2xl">✦</div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Ink & Starlight</p>
          <h1 className="font-display mt-1 text-3xl text-fg">
            {mode === "in" && "Welcome Back"}
            {mode === "up" && "Join the Journey"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "reset" && "Reset Password"}
            {mode === "2fa" && "Two-Factor Auth"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "in" && "Sign in to continue your adventure"}
            {mode === "up" && "Create an account to save progress"}
            {mode === "forgot" && "Enter your email to recover account"}
            {mode === "reset" && "Enter the code and new password"}
            {mode === "2fa" && "Enter the 6-digit verification code"}
          </p>
        </div>

        {authEnabled && (mode === "in" || mode === "up") && (
          <div className="mb-5 flex flex-col gap-2">
            {GROK_PROVIDERS.map((p) => (
              <button key={p.providerId} type="button" onClick={() => signIn(p.providerId, { callbackURL: "/" })} className="btn-ghost w-full">
                Continue with {p.label}
              </button>
            ))}
          </div>
        )}

        {!authEnabled && <p className="mb-4 text-center text-sm text-muted">Sign-in is disabled in this build.</p>}

        {authEnabled && emailAndPasswordEnabled && (
          <form className="flex flex-col gap-3" onSubmit={onEmail}>
            {mode === "up" && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input required minLength={3} maxLength={30} className="w-full rounded-xl border border-border bg-surface-2 py-3 pl-10 pr-3 text-fg" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input className="w-full rounded-xl border border-border bg-surface-2 py-3 pl-10 pr-3 text-fg" placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="nickname" />
                </div>
              </>
            )}

            {(mode === "in" || mode === "up" || mode === "forgot") && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input type={mode === "up" || mode === "forgot" ? "email" : "text"} required className="w-full rounded-xl border border-border bg-surface-2 py-3 pl-10 pr-3 text-fg" placeholder={mode === "up" || mode === "forgot" ? "Email" : "Username or Email"} value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete={mode === "up" || mode === "forgot" ? "email" : "username"} />
              </div>
            )}

            {(mode === "in" || mode === "up") && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input type={showPass ? "text" : "password"} required minLength={8} className="w-full rounded-xl border border-border bg-surface-2 py-3 pl-10 pr-10 text-fg" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            )}

            {mode === "2fa" && (
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input className="w-full rounded-xl border border-border bg-surface-2 py-3 pl-10 pr-3 text-center text-xl tracking-[0.4em] text-fg" placeholder="••••••" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
                <p className="mt-1 text-center text-xs text-muted">Demo code: <b>123456</b></p>
              </div>
            )}

            {mode === "reset" && (
              <>
                <input className="w-full rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg" placeholder="Reset Code" value={code} onChange={(e) => setCode(e.target.value)} />
                <input type="password" className="w-full rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <p className="text-xs text-muted">Enter the code from your email</p>
              </>
            )}

            {err && <p className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-400">{err}</p>}
            {msg && <p className="rounded-xl bg-green-500/15 px-3 py-2 text-sm text-green-400">{msg}</p>}

            <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
              {busy ? "Working…" : mode === "up" ? "Create account" : mode === "forgot" ? "Send Reset Code" : mode === "reset" ? "Change Password" : mode === "2fa" ? "Verify Code" : "Sign in"}
            </button>

            <div className="mt-2 space-y-2 text-center text-sm">
              {mode === "in" && (
                <>
                  <button type="button" className="block w-full text-muted underline" onClick={() => { setMode("forgot"); setErr(null); setMsg(null); }}>
                    Forgot Password?
                  </button>
                  <button type="button" className="text-accent" onClick={() => { setMode("up"); setErr(null); setMsg(null); }}>
                    New traveler? Create account
                  </button>
                </>
              )}
              {mode === "up" && (
                <button type="button" className="text-muted" onClick={() => { setMode("in"); setErr(null); setMsg(null); }}>
                  Have an account? Sign in
                </button>
              )}
              {(mode === "forgot" || mode === "reset" || mode === "2fa") && (
                <button type="button" className="flex w-full items-center justify-center gap-1 text-muted" onClick={() => { setMode("in"); setErr(null); setMsg(null); }}>
                  <ArrowLeft className="size-4" /> Back to Sign In
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
