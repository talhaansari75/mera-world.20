import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";

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
          username,
          displayUsername: username,
        });

        if (res.error) {
          throw new Error(res.error.message || "Sign up failed");
        }

        window.location.href = "/";
      } else if (mode === "in") {
        const res = identifier.includes("@")
          ? await authClient.signIn.email({
              email: identifier,
              password,
            })
          : await authClient.signIn.username({
              username: identifier,
              password,
            });

        if (res.error) {
          throw new Error(res.error.message || "Sign in failed");
        }

        window.location.href = "/";
      } else if (mode === "forgot") {
        const { error } = await authClient.requestPasswordReset({
          email: identifier,
          redirectTo: `${window.location.origin}/login?reset=1`,
        });

        if (error) {
          throw new Error(
            error.message || "Could not send reset email",
          );
        }

        setMsg(
          "Agar yeh email registered hai to reset link email mein bhej diya gaya hai.",
        );
      } else if (mode === "reset") {
        if (code !== "654321") {
          throw new Error("Invalid reset code");
        }

        if (newPassword.length < 8) {
          throw new Error("Password must be 8+ characters");
        }

        setMsg("Password changed! Please sign in.");
        setMode("in");
      } else if (mode === "2fa") {
        if (code !== "123456") {
          throw new Error("Invalid 2FA code");
        }

        window.location.href = "/";
      }
    } catch (error) {
      setErr(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      );
    } finally {
      setBusy(false);
    }
  };

  const title =
    mode === "in"
      ? "Welcome back, Traveler"
      : mode === "up"
        ? "Begin your journey"
        : mode === "forgot"
          ? "Recover your account"
          : mode === "reset"
            ? "Create a new password"
            : "Secure your journey";

  const subtitle =
    mode === "in"
      ? "Your next word adventure is waiting."
      : mode === "up"
        ? "Create your profile and let the story begin."
        : mode === "forgot"
          ? "We'll help you get back into your world."
          : mode === "reset"
            ? "A fresh password, then you're ready to explore."
            : "Enter the 6-digit verification code.";

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3.5 text-sm text-white outline-none ring-1 ring-transparent transition duration-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-400/20";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#060914] text-white selection:bg-fuchsia-400/30">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/25 blur-[110px]" />
        <div className="absolute -right-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="absolute bottom-[-14rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />

        <Star className="absolute left-[12%] top-[17%] h-3 w-3 animate-pulse text-indigo-200" />
        <Star className="absolute right-[18%] top-[22%] h-4 w-4 animate-pulse text-amber-200 [animation-delay:700ms]" />
        <Star className="absolute bottom-[18%] left-[16%] h-3 w-3 animate-pulse text-cyan-200 [animation-delay:1200ms]" />
        <Star className="absolute bottom-[28%] right-[12%] h-3 w-3 animate-pulse text-fuchsia-200 [animation-delay:400ms]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl lg:grid-cols-[1.05fr_.95fr]">

          {/* Left / Brand */}
          <section className="relative hidden min-h-[680px] overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-indigo-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                INK & STARLIGHT
              </div>

              <h1 className="mt-10 max-w-xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight">
                Words become paths.
                <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                  Paths become adventures.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                Enter a beautiful world of hidden words, glowing
                discoveries, and stories waiting to unfold.
              </p>
            </div>

            {/* Word Grid */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/10 to-amber-400/20 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/50 p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Your next chapter
                  </span>
                  <Wand2 className="h-5 w-5 text-amber-300" />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    "W","O","R","D","S",
                    "S","T","A","R","S",
                    "J","O","U","R","N",
                    "E","Y","G","L","O",
                    "W","E","R","S","X",
                  ].map((letter, i) => (
                    <div
                      key={i}
                      className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold ${
                        [2, 7, 12, 18, 22].includes(i)
                          ? "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.15)]"
                          : "border-white/5 bg-white/[0.04] text-slate-300"
                      }`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  Discover. Solve. Build your world.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-white/10" />
              <span>Every word opens a new door</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </section>

          {/* Right / Login */}
          <section className="flex min-h-[680px] flex-col justify-center p-5 sm:p-8 lg:p-12">
            <div className="mx-auto w-full max-w-md">

              <div className="mb-8 text-center lg:text-left">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-white/15 bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 shadow-lg shadow-indigo-900/30 lg:mx-0">
                  <Sparkles className="h-8 w-8 text-amber-200" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200/80 lg:hidden">
                  Ink & Starlight
                </p>

                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {subtitle}
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-4 shadow-2xl sm:p-6">

                {authEnabled && (
                  <div className="mb-5 space-y-2.5">
                    {GROK_PROVIDERS.map((p) => (
                      <button
                        key={p.providerId}
                        type="button"
                        onClick={() =>
                          signIn(p.providerId, {
                            callbackURL: "/",
                          })
                        }
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-lg"
                      >
                        <span className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,.6)]" />
                        Continue with {p.label}
                      </button>
                    ))}
                  </div>
                )}

                {!authEnabled && (
                  <p className="mb-4 rounded-2xl border border-amber-300/10 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                    Sign-in is disabled in this build.
                  </p>
                )}

                {authEnabled && emailAndPasswordEnabled && (
                  <form onSubmit={onEmail} className="space-y-3.5">

                    {mode === "up" && (
                      <>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <input
                            className={`${inputClass} pl-11 pr-4`}
                            placeholder="Username"
                            value={username}
                            onChange={(e) =>
                              setUsername(e.target.value)
                            }
                            autoComplete="username"
                          />
                        </div>

                        <div className="relative">
                          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <input
                            className={`${inputClass} pl-11 pr-4`}
                            placeholder="Display name"
                            value={name}
                            onChange={(e) =>
                              setName(e.target.value)
                            }
                            autoComplete="nickname"
                          />
                        </div>
                      </>
                    )}

                    {(mode === "in" ||
                      mode === "up" ||
                      mode === "forgot") && (
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          className={`${inputClass} pl-11 pr-4`}
                          placeholder={
                            mode === "in"
                              ? "Email or username"
                              : "Email"
                          }
                          value={identifier}
                          onChange={(e) =>
                            setIdentifier(e.target.value)
                          }
                          autoComplete="email"
                        />
                      </div>
                    )}

                    {(mode === "in" || mode === "up") && (
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          type={showPass ? "text" : "password"}
                          className={`${inputClass} pl-11 pr-12`}
                          placeholder="Password"
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          autoComplete={
                            mode === "up"
                              ? "new-password"
                              : "current-password"
                          }
                        />

                        <button
                          type="button"
                          aria-label={
                            showPass
                              ? "Hide password"
                              : "Show password"
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                          onClick={() =>
                            setShowPass(!showPass)
                          }
                        >
                          {showPass ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}

                    {mode === "2fa" && (
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                        <input
                          className={`${inputClass} pl-11 pr-4 text-center text-lg tracking-[0.35em]`}
                          placeholder="000000"
                          value={code}
                          onChange={(e) =>
                            setCode(
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6),
                            )
                          }
                        />

                        <p className="mt-2 text-center text-xs text-slate-500">
                          Demo code:{" "}
                          <b className="text-slate-300">
                            123456
                          </b>
                        </p>
                      </div>
                    )}

                    {mode === "reset" && (
                      <>
                        <input
                          className={`${inputClass} px-4`}
                          placeholder="Reset Code"
                          value={code}
                          onChange={(e) =>
                            setCode(e.target.value)
                          }
                        />

                        <input
                          type="password"
                          className={`${inputClass} px-4`}
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(e.target.value)
                          }
                        />
                      </>
                    )}

                    {err && (
                      <p className="rounded-2xl border border-red-400/10 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {err}
                      </p>
                    )}

                    {msg && (
                      <p className="rounded-2xl border border-emerald-400/10 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                        {msg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:translate-y-0 disabled:opacity-60"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative">
                        {busy
                          ? "Working..."
                          : mode === "up"
                            ? "Create my account"
                            : mode === "forgot"
                              ? "Send reset link"
                              : mode === "reset"
                                ? "Change password"
                                : mode === "2fa"
                                  ? "Verify code"
                                  : "Enter my world →"}
                      </span>
                    </button>

                    <div className="space-y-3 pt-2 text-center text-sm">
                      {mode === "in" && (
                        <>
                          <button
                            type="button"
                            className="text-slate-400 transition hover:text-white"
                            onClick={() => {
                              setMode("forgot");
                              setErr(null);
                              setMsg(null);
                            }}
                          >
                            Forgot password?
                          </button>

                          <div>
                            <button
                              type="button"
                              className="font-semibold text-indigo-300 transition hover:text-indigo-200"
                              onClick={() => {
                                setMode("up");
                                setErr(null);
                                setMsg(null);
                              }}
                            >
                              New traveler? Create an account
                            </button>
                          </div>
                        </>
                      )}

                      {mode === "up" && (
                        <button
                          type="button"
                          className="text-slate-400 transition hover:text-white"
                          onClick={() => {
                            setMode("in");
                            setErr(null);
                            setMsg(null);
                          }}
                        >
                          Already have an account? Sign in
                        </button>
                      )}

                      {(mode === "forgot" ||
                        mode === "reset" ||
                        mode === "2fa") && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white"
                          onClick={() => {
                            setMode("in");
                            setErr(null);
                            setMsg(null);
                          }}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Sign In
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              <p className="mt-5 text-center text-[11px] leading-5 text-slate-600">
                By continuing, you're stepping into your own little
                word universe.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
