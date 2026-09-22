import React, { useEffect, useState } from "react";
import { Screen } from "./chrome";
import { authClient } from "@/lib/auth/client";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void authClient.getSession().then(({ data }) => {
      if (!cancelled && data?.user) window.location.href = "/";
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async () => {
    setMsg("");
    setLoading(true);

    try {
      if (!email.trim()) {
        setMsg("Please enter your email address.");
        return;
      }

      if (mode === "login") {
        if (!password) {
          setMsg("Please enter your password.");
          return;
        }

        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/",
        });

        if (error) {
          setMsg(error.message || "Invalid email or password.");
          return;
        }

        window.location.href = "/";
        return;
      }

      if (mode === "signup") {
        if (!name.trim()) {
          setMsg("Please enter your name.");
          return;
        }
        if (password.length < 8) {
          setMsg("Password must be at least 8 characters.");
          return;
        }

        const { error } = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          callbackURL: "/",
        });

        if (error) {
          setMsg(error.message || "Could not create account.");
          return;
        }

        window.location.href = "/";
        return;
      }

      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: "/login",
      });

      if (error) {
        setMsg(error.message || "Could not send the password reset email.");
      } else {
        setMsg("If this email is registered, a password reset link has been sent.");
      }
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    localStorage.setItem("mera-world.guest", "1");
    window.location.href = "/";
  };

  return (
    <Screen title={mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Forgot Password"}>
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-primary/20 text-3xl">✦</div>
          <h1 className="font-display text-3xl text-fg">
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Join the Journey"}
            {mode === "forgot" && "Recover Account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login" && "Continue your word adventure"}
            {mode === "signup" && "Start exploring 2000 levels"}
            {mode === "forgot" && "We'll help you get back in"}
          </p>
        </div>

        <div className="panel rounded-3xl p-6 space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input
                className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-4 text-fg outline-none ring-1 ring-white/10 focus:ring-primary"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-4 text-fg outline-none ring-1 ring-white/10 focus:ring-primary"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {(mode === "login" || mode === "signup") && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input
                className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-12 text-fg outline-none ring-1 ring-white/10 focus:ring-primary"
                placeholder="Password (8+ characters)"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submit();
                }}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          )}

          {msg && (
            <div className="rounded-2xl bg-red-500/15 p-3 text-sm text-red-400">
              {msg}
            </div>
          )}

          <button
            className="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-60"
            onClick={() => void submit()}
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Sign In"
                : mode === "signup"
                  ? "Create Account"
                  : "Send Reset Link"}
          </button>

          <button
            type="button"
            className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-fg hover:bg-white/10"
            onClick={continueAsGuest}
          >
            Continue as Guest
          </button>
          <p className="text-center text-[11px] text-muted">Guest access: first 10 levels only. Sign in later to keep your progress in the cloud.</p>

          <div className="space-y-2 pt-2 text-center text-sm">
            {mode === "login" && (
              <>
                <button
                  className="text-muted hover:text-fg underline"
                  onClick={() => { setMode("forgot"); setMsg(""); }}
                >
                  Forgot Password?
                </button>
                <div>
                  <button
                    className="text-accent"
                    onClick={() => { setMode("signup"); setMsg(""); }}
                  >
                    Create a new account
                  </button>
                </div>
              </>
            )}

            {mode === "signup" && (
              <button
                className="text-muted"
                onClick={() => { setMode("login"); setMsg(""); }}
              >
                Already have an account? Sign In
              </button>
            )}

            {mode === "forgot" && (
              <button
                className="text-muted"
                onClick={() => { setMode("login"); setMsg(""); }}
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}
