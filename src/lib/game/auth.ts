export type AuthUser = {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
};

export type AuthResult = {
  ok: boolean;
  user?: AuthUser;
  error?: string;
  token?: string;
  requires2FA?: boolean;
};

const SESSION_KEY = "mwsj.auth.session";
const USERS_KEY = "mwsj.auth.users";

function loadUsers(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, any>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function localSignUp(email: string, password: string, name: string): AuthResult {
  email = email.toLowerCase().trim();
  if (!email.includes("@") || password.length < 8) {
    return { ok: false, error: "Valid email aur 8+ character password chahiye." };
  }

  const users = loadUsers();
  if (users[email]) {
    return { ok: false, error: "Yeh email already registered hai." };
  }

  const user: AuthUser = {
    id: `local-${Date.now()}`,
    email,
    name: name.trim() || email.split("@")[0],
    createdAt: Date.now(),
    twoFactorEnabled: false,
  };

  users[email] = { ...user, password };
  saveUsers(users);

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user, token: user.id };
}

export function localSignIn(email: string, password: string): AuthResult {
  email = email.toLowerCase().trim();
  const users = loadUsers();
  const stored = users[email];

  if (!stored || stored.password !== password) {
    return { ok: false, error: "Invalid email or password." };
  }

  const user: AuthUser = {
    id: stored.id,
    email: stored.email,
    name: stored.name,
    createdAt: stored.createdAt,
    twoFactorEnabled: !!stored.twoFactorEnabled,
    twoFactorSecret: stored.twoFactorSecret,
  };

  if (user.twoFactorEnabled) {
    sessionStorage.setItem("mwsj.pending.2fa", JSON.stringify(user));
    return { ok: false, requires2FA: true, error: "2FA code required" };
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user, token: user.id };
}

export function verify2FA(code: string): AuthResult {
  const pending = sessionStorage.getItem("mwsj.pending.2fa");
  if (!pending) return { ok: false, error: "No pending 2FA session" };

  const user = JSON.parse(pending) as AuthUser;
  const valid = code === "123456" || code === user.twoFactorSecret;

  if (!valid) {
    return { ok: false, error: "Invalid 2FA code. Try 123456 for demo." };
  }

  sessionStorage.removeItem("mwsj.pending.2fa");
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user, token: user.id };
}

export function enable2FA(): { secret: string } {
  const user = getSession();
  if (!user) throw new Error("Not logged in");

  const secret = Math.random().toString(36).substring(2, 10).toUpperCase();
  const users = loadUsers();
  if (users[user.email]) {
    users[user.email].twoFactorEnabled = true;
    users[user.email].twoFactorSecret = secret;
    saveUsers(users);
  }

  const updated = { ...user, twoFactorEnabled: true, twoFactorSecret: secret };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return { secret };
}

export function disable2FA() {
  const user = getSession();
  if (!user) return;

  const users = loadUsers();
  if (users[user.email]) {
    users[user.email].twoFactorEnabled = false;
    delete users[user.email].twoFactorSecret;
    saveUsers(users);
  }

  const updated = { ...user, twoFactorEnabled: false };
  delete (updated as any).twoFactorSecret;
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
}

export function requestPasswordReset(email: string): AuthResult {
  email = email.toLowerCase().trim();
  const users = loadUsers();
  if (!users[email]) {
    return { ok: false, error: "Email not found." };
  }
  const code = "654321";
  sessionStorage.setItem("mwsj.reset." + email, code);
  return { ok: true, error: `Reset code: ${code} (demo)` };
}

export function resetPassword(email: string, code: string, newPassword: string): AuthResult {
  email = email.toLowerCase().trim();
  const storedCode = sessionStorage.getItem("mwsj.reset." + email);
  if (storedCode !== code) {
    return { ok: false, error: "Invalid reset code." };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "Password must be 8+ characters." };
  }

  const users = loadUsers();
  if (!users[email]) return { ok: false, error: "User not found." };

  users[email].password = newPassword;
  saveUsers(users);
  sessionStorage.removeItem("mwsj.reset." + email);
  return { ok: true };
}
