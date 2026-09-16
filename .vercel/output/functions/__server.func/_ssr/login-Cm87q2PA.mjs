import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, y as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-BLD5ZMZO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Cm87q2PA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("in");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const onEmail = async (e) => {
		e.preventDefault();
		setBusy(true);
		setErr(null);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || "Traveler"
				});
				if (res.error) throw new Error(res.error.message || "Sign up failed");
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message || "Sign in failed");
			}
			window.location.href = "/";
		} catch (ex) {
			setErr(ex instanceof Error ? ex.message : "Could not sign in");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "app-shell starfield safe-pad grid min-h-dvh place-items-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel w-full max-w-sm rounded-3xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.2em] text-accent",
					children: "Optional"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-2xl text-fg",
					children: "Join the hall"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Cloud save and leaderboards. Guests keep every page locally — no forced login."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex flex-col gap-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(p.providerId, { callbackURL: "/" }),
						className: "btn-ghost",
						children: ["Continue with ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-5 flex flex-col gap-2",
					onSubmit: onEmail,
					children: [
						mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg",
							placeholder: "Display name",
							value: name,
							onChange: (e) => setName(e.target.value),
							autoComplete: "nickname"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							className: "rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg",
							placeholder: "Email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							autoComplete: "email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							minLength: 8,
							className: "rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg",
							placeholder: "Password (8+ characters)",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoComplete: mode === "up" ? "new-password" : "current-password"
						}),
						err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: err
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "btn-primary",
							disabled: busy,
							children: busy ? "Working…" : mode === "up" ? "Create account" : "Sign in with email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted",
							onClick: () => setMode(mode === "up" ? "in" : "up"),
							children: mode === "up" ? "Have an account? Sign in" : "New traveler? Create account"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "btn-ghost mt-5",
					children: "Continue as guest"
				})
			]
		})
	});
}
//#endregion
export { Login as component };
