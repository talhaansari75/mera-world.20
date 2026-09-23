import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield, Sparkles } from "lucide-react";

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
      } else if (mode === "2fa") {
        if (code !== "123456") throw new Error("Invalid 2FA code");
        window.location.href = "/";
      }
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const title =
    mode === "in" ? "Welcome Back" :
    mode === "up" ? "Join the Journey" :
    mode === "forgot" ? "Forgot Password" :
    mode === "reset" ? "Reset Password" : "Two-Factor Auth";

  const subtitle =
    mode === "in" ? "Sign in to continue your adventure" :
    mode === "up" ? "Create an account to save progress" :
    mode === "forgot" ? "Enter your email to recover account" :
    mode === "reset" ? "Enter the code and new password" :
    "Enter the 6-digit verification code";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[#0b1020] via-[#12182b] to-[#0b1020] text-white">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="h-7 w-7 text-amber-300" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-indigo-200/80">Ink & Starlight</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-white">
            Mera Word Search Journey
          </h1>
          <p className="mt-2 text-sm text-slate-300">Words become paths. Paths become adventures.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
          </div>

          {authEnabled && (
            <div className="mb-5 space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Continue with {p.label}
                </button>
              ))}
            </div>
          )}

          {!authEnabled && (
            <p className="mb-4 rounded-xl bg-amber-500/15 px-3 py-2 text-sm text-amber-200">
              Sign-in is disabled in this build.
            </p>
          )}

          {authEnabled && emailAndPasswordEnabled && (
            <form onSubmit={onEmail} className="space-y-3">
              {mode === "up" && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-white outline-none ring-indigo-400/40 placeholder:text-slate-500 focus:ring-2"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-white outline-none ring-indigo-400/40 placeholder:text-slate-500 focus:ring-2"
                      placeholder="Display name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="nickname"
                    />
                  </div>
                </>
              )}

              {(mode === "in" || mode === "up" || mode === "forgot") && (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-white outline-none ring-indigo-400/40 placeholder:text-slate-500 focus:ring-2"
                    placeholder={mode === "in" ? "Email or username" : "Email"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              )}

              {(mode === "in" || mode === "up") && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-12 text-sm text-white outline-none ring-indigo-400/40 placeholder:text-slate-500 focus:ring-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}

              {mode === "2fa" && (
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-center text-lg tracking-[0.3em] text-white outline-none ring-indigo-400/40 placeholder:text-slate-500 focus:ring-2"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  <p className="mt-1 text-center text-xs text-slate-400">Demo code: <b>123456</b></p>
                </div>
              )}

              {mode === "reset" && (
                <>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none ring-indigo-400/40 placeholder:text-slate-500 focus:ring-2"
                    placeholder="Reset Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none ring-indigo-400/40 placeholder:text-slate-500 focus:ring-2"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </>
              )}

              {err && <p className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-300">{err}</p>}
              {msg && <p className="rounded-xl bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">{msg}</p>}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-95 disabled:opacity-60"
              >
                {busy
                  ? "Working…"
                  : mode === "up"
                    ? "Create account"
                    : mode === "forgot"
                      ? "Send Reset Code"
                      : mode === "reset"
                        ? "Change Password"
                        : mode === "2fa"
                          ? "Verify Code"
                          : "Sign in"}
              </button>

              <div className="space-y-2 pt-1 text-center text-sm">
                {mode === "in" && (
                  <>
                    <button
                      type="button"
                      className="block w-full text-slate-300 underline"
                      onClick={() => { setMode("forgot"); setErr(null); setMsg(null); }}
                    >
                      Forgot Password?
                    </button>
                    <button
                      type="button"
                      className="text-indigo-300"
                      onClick={() => { setMode("up"); setErr(null); setMsg(null); }}
                    >
                      New traveler? Create account
                    </button>
                  </>
                )}
                {mode === "up" && (
                  <button
                    type="button"
                    className="text-slate-300"
                    onClick={() => { setMode("in"); setErr(null); setMsg(null); }}
                  >
                    Have an account? Sign in
                  </button>
                )}
                {(mode === "forgot" || mode === "reset" || mode === "2fa") && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-slate-300"
                    onClick={() => { setMode("in"); setErr(null); setMsg(null); }}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Sign In
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
