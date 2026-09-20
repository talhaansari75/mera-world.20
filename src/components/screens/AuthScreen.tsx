import React, { useState } from "react";
import { Screen } from "./chrome";
import {
  localSignIn,
  localSignUp,
  getSession,
  signOut,
  verify2FA,
  enable2FA,
  disable2FA,
  requestPasswordReset,
  resetPassword,
} from "@/lib/game/auth";
import { Mail, Lock, User, Shield, KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react";

type Mode = "login" | "signup" | "forgot" | "reset" | "2fa";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState("");

  const user = getSession();

  if (user && mode !== "2fa") {
    return (
      <Screen title="Account">
        <div className="mx-auto max-w-md space-y-5">
          <div className="panel rounded-3xl p-6 text-center">
            <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-primary/20 text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-display text-2xl text-fg">{user.name}</h2>
            <p className="mt-1 text-sm text-muted">{user.email}</p>

            <div className="mt-6 space-y-3">
              {user.twoFactorEnabled ? (
                <div className="rounded-2xl bg-green-500/10 p-4 text-left">
                  <div className="flex items-center gap-2 text-green-400">
                    <Shield className="size-5" />
                    <span className="font-semibold">2FA Enabled</span>
                  </div>
                  <button className="mt-3 text-sm text-red-400 underline" onClick={() => { disable2FA(); location.reload(); }}>
                    Disable 2FA
                  </button>
                </div>
              ) : (
                <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={() => { const { secret } = enable2FA(); setTwoFASecret(secret); }}>
                  <Shield className="size-4" /> Enable 2-Factor Authentication
                </button>
              )}

              {twoFASecret && (
                <div className="rounded-2xl bg-accent/10 p-4 text-sm">
                  <p className="font-semibold text-accent">Your 2FA Secret:</p>
                  <p className="mt-1 font-mono text-lg tracking-widest">{twoFASecret}</p>
                  <p className="mt-2 text-xs text-muted">Demo code: <b>123456</b></p>
                </div>
              )}

              <button className="hud-chip w-full" onClick={() => { signOut(); location.reload(); }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </Screen>
    );
  }

  const submit = () => {
    setMsg("");
    if (mode === "signup") {
      const r = localSignUp(email, password, name);
      if (r.ok) location.reload();
      else setMsg(r.error || "Error");
    } else if (mode === "login") {
      const r = localSignIn(email, password);
      if (r.ok) location.reload();
      else if (r.requires2FA) {
        setMode("2fa");
        setMsg("Enter your 2FA code");
      } else setMsg(r.error || "Error");
    } else if (mode === "2fa") {
      const r = verify2FA(code);
      if (r.ok) location.reload();
      else setMsg(r.error || "Invalid code");
    } else if (mode === "forgot") {
      const r = requestPasswordReset(email);
      if (r.ok) {
        setMode("reset");
        setMsg(r.error || "Code sent");
      } else setMsg(r.error || "Error");
    } else if (mode === "reset") {
      const r = resetPassword(email, code, newPassword);
      if (r.ok) {
        setMode("login");
        setMsg("Password changed! Please login.");
      } else setMsg(r.error || "Error");
    }
  };

  return (
    <Screen title={
      mode === "login" ? "Welcome Back" :
      mode === "signup" ? "Create Account" :
      mode === "forgot" ? "Forgot Password" :
      mode === "reset" ? "Reset Password" : "Two-Factor Auth"
    }>
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-primary/20 text-3xl">✦</div>
          <h1 className="font-display text-3xl text-fg">
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Join the Journey"}
            {mode === "forgot" && "Recover Account"}
            {mode === "reset" && "New Password"}
            {mode === "2fa" && "Security Check"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login" && "Continue your word adventure"}
            {mode === "signup" && "Start exploring 2000 levels"}
            {mode === "forgot" && "We'll help you get back in"}
            {mode === "2fa" && "Enter the 6-digit code"}
          </p>
        </div>

        <div className="panel rounded-3xl p-6 space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-4 text-fg outline-none ring-1 ring-white/10 focus:ring-primary" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}

          {(mode === "login" || mode === "signup" || mode === "forgot" || mode === "reset") && (
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-4 text-fg outline-none ring-1 ring-white/10 focus:ring-primary" placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          )}

          {(mode === "login" || mode === "signup") && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-12 text-fg outline-none ring-1 ring-white/10 focus:ring-primary" placeholder="Password (8+ characters)" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          )}

          {mode === "2fa" && (
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-4 text-center text-2xl tracking-[0.5em] text-fg outline-none ring-1 ring-white/10 focus:ring-primary" placeholder="••••••" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
              <p className="mt-2 text-center text-xs text-muted">Demo code: <b>123456</b></p>
            </div>
          )}

          {mode === "reset" && (
            <>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
                <input className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-4 text-fg outline-none ring-1 ring-white/10 focus:ring-primary" placeholder="Reset Code" value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
                <input className="w-full rounded-2xl bg-black/20 py-3.5 pl-12 pr-4 text-fg outline-none ring-1 ring-white/10 focus:ring-primary" placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
            </>
          )}

          {msg && (
            <div className={`rounded-2xl p-3 text-sm ${msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("error") || msg.toLowerCase().includes("not found") ? "bg-red-500/15 text-red-400" : "bg-green-500/15 text-green-400"}`}>
              {msg}
            </div>
          )}

          <button className="btn-primary w-full py-3.5 text-base font-semibold" onClick={submit}>
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Send Reset Code"}
            {mode === "reset" && "Change Password"}
            {mode === "2fa" && "Verify Code"}
          </button>

          <div className="space-y-2 pt-2 text-center text-sm">
            {mode === "login" && (
              <>
                <button className="text-muted hover:text-fg underline" onClick={() => { setMode("forgot"); setMsg(""); }}>
                  Forgot Password?
                </button>
                <div>
                  <button className="text-accent" onClick={() => { setMode("signup"); setMsg(""); }}>
                    Create a new account
                  </button>
                </div>
              </>
            )}
            {mode === "signup" && (
              <button className="text-muted" onClick={() => { setMode("login"); setMsg(""); }}>
                Already have an account? Sign In
              </button>
            )}
            {(mode === "forgot" || mode === "reset" || mode === "2fa") && (
              <button className="flex items-center justify-center gap-1 text-muted" onClick={() => { setMode("login"); setMsg(""); }}>
                <ArrowLeft className="size-4" /> Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}
