import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-COJc7NkC.mjs";
import { a as GROK_PROVIDERS } from "./verify.server-CdYricdb.mjs";
import { A as Mail, G as EyeOff, W as Eye, f as Star, g as Shield, i as WandSparkles, j as Lock, lt as ArrowLeft, p as Sparkles, s as User } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Bt42S3mC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const [identifier, setIdentifier] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("in");
	const [err, setErr] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [showPass, setShowPass] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const onEmail = async (e) => {
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
					displayUsername: username
				});
				if (res.error) throw new Error(res.error.message || "Sign up failed");
				window.location.href = "/";
			} else if (mode === "in") {
				const res = identifier.includes("@") ? await authClient.signIn.email({
					email: identifier,
					password
				}) : await authClient.signIn.username({
					username: identifier,
					password
				});
				if (res.error) throw new Error(res.error.message || "Sign in failed");
				window.location.href = "/";
			} else if (mode === "forgot") {
				const { error } = await authClient.requestPasswordReset({
					email: identifier,
					redirectTo: `${window.location.origin}/login?reset=1`
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
	const title = mode === "in" ? "Welcome back, Traveler" : mode === "up" ? "Begin your journey" : mode === "forgot" ? "Recover your account" : mode === "reset" ? "Create a new password" : "Secure your journey";
	const subtitle = mode === "in" ? "Your next word adventure is waiting." : mode === "up" ? "Create your profile and let the story begin." : mode === "forgot" ? "We'll help you get back into your world." : mode === "reset" ? "A fresh password, then you're ready to explore." : "Enter the 6-digit verification code.";
	const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3.5 text-sm text-white outline-none ring-1 ring-transparent transition duration-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-400/20";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden bg-[#060914] text-white selection:bg-fuchsia-400/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/25 blur-[110px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/20 blur-[120px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-[-14rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[130px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-[0.07]",
					style: {
						backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
						backgroundSize: "34px 34px"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "absolute left-[12%] top-[17%] h-3 w-3 animate-pulse text-indigo-200" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "absolute right-[18%] top-[22%] h-4 w-4 animate-pulse text-amber-200 [animation-delay:700ms]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "absolute bottom-[18%] left-[16%] h-3 w-3 animate-pulse text-cyan-200 [animation-delay:1200ms]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "absolute bottom-[28%] right-[12%] h-3 w-3 animate-pulse text-fuchsia-200 [animation-delay:400ms]" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl lg:grid-cols-[1.05fr_.95fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative hidden min-h-[680px] overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-indigo-100 backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-amber-300" }), "INK & STARLIGHT"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-10 max-w-xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight",
								children: ["Words become paths.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-2 block bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent",
									children: "Paths become adventures."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 max-w-md text-base leading-7 text-slate-300",
								children: "Enter a beautiful world of hidden words, glowing discoveries, and stories waiting to unfold."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mx-auto w-full max-w-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/10 to-amber-400/20 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative rounded-[2rem] border border-white/10 bg-slate-950/50 p-6 shadow-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase tracking-[0.25em] text-slate-400",
											children: "Your next chapter"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-5 w-5 text-amber-300" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-5 gap-2",
										children: [
											"W",
											"O",
											"R",
											"D",
											"S",
											"S",
											"T",
											"A",
											"R",
											"S",
											"J",
											"O",
											"U",
											"R",
											"N",
											"E",
											"Y",
											"G",
											"L",
											"O",
											"W",
											"E",
											"R",
											"S",
											"X"
										].map((letter, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold ${[
												2,
												7,
												12,
												18,
												22
											].includes(i) ? "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.15)]" : "border-white/5 bg-white/[0.04] text-slate-300"}`,
											children: letter
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-5 text-sm text-slate-400",
										children: "Discover. Solve. Build your world."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-xs text-slate-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-white/10" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Every word opens a new door" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-white/10" })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "flex min-h-[680px] flex-col justify-center p-5 sm:p-8 lg:p-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto w-full max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-8 text-center lg:text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-white/15 bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 shadow-lg shadow-indigo-900/30 lg:mx-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 text-amber-200" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200/80 lg:hidden",
										children: "Ink & Starlight"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 font-serif text-3xl font-semibold tracking-tight text-white",
										children: title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-6 text-slate-400",
										children: subtitle
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-4 shadow-2xl sm:p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-5 space-y-2.5",
										children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => signIn(p.providerId, { callbackURL: "/" }),
											className: "group flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-lg",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,.6)]" }),
												"Continue with ",
												p.label
											]
										}, p.providerId))
									}),
									false,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: onEmail,
										className: "space-y-3.5",
										children: [
											mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: `${inputClass} pl-11 pr-4`,
													placeholder: "Username",
													value: username,
													onChange: (e) => setUsername(e.target.value),
													autoComplete: "username"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: `${inputClass} pl-11 pr-4`,
													placeholder: "Display name",
													value: name,
													onChange: (e) => setName(e.target.value),
													autoComplete: "nickname"
												})]
											})] }),
											(mode === "in" || mode === "up" || mode === "forgot") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: `${inputClass} pl-11 pr-4`,
													placeholder: mode === "in" ? "Email or username" : "Email",
													value: identifier,
													onChange: (e) => setIdentifier(e.target.value),
													autoComplete: "email"
												})]
											}),
											(mode === "in" || mode === "up") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: showPass ? "text" : "password",
														className: `${inputClass} pl-11 pr-12`,
														placeholder: "Password",
														value: password,
														onChange: (e) => setPassword(e.target.value),
														autoComplete: mode === "up" ? "new-password" : "current-password"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": showPass ? "Hide password" : "Show password",
														className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white",
														onClick: () => setShowPass(!showPass),
														children: showPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
													})
												]
											}),
											mode === "2fa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														className: `${inputClass} pl-11 pr-4 text-center text-lg tracking-[0.35em]`,
														placeholder: "000000",
														value: code,
														onChange: (e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-2 text-center text-xs text-slate-500",
														children: [
															"Demo code:",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
																className: "text-slate-300",
																children: "123456"
															})
														]
													})
												]
											}),
											mode === "reset" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: `${inputClass} px-4`,
												placeholder: "Reset Code",
												value: code,
												onChange: (e) => setCode(e.target.value)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "password",
												className: `${inputClass} px-4`,
												placeholder: "New Password",
												value: newPassword,
												onChange: (e) => setNewPassword(e.target.value)
											})] }),
											err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "rounded-2xl border border-red-400/10 bg-red-500/10 px-4 py-3 text-sm text-red-300",
												children: err
											}),
											msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "rounded-2xl border border-emerald-400/10 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300",
												children: msg
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "submit",
												disabled: busy,
												className: "group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:translate-y-0 disabled:opacity-60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-700 group-hover:translate-x-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "relative",
													children: busy ? "Working..." : mode === "up" ? "Create my account" : mode === "forgot" ? "Send reset link" : mode === "reset" ? "Change password" : mode === "2fa" ? "Verify code" : "Enter my world →"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-3 pt-2 text-center text-sm",
												children: [
													mode === "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "text-slate-400 transition hover:text-white",
														onClick: () => {
															setMode("forgot");
															setErr(null);
															setMsg(null);
														},
														children: "Forgot password?"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "font-semibold text-indigo-300 transition hover:text-indigo-200",
														onClick: () => {
															setMode("up");
															setErr(null);
															setMsg(null);
														},
														children: "New traveler? Create an account"
													}) })] }),
													mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "text-slate-400 transition hover:text-white",
														onClick: () => {
															setMode("in");
															setErr(null);
															setMsg(null);
														},
														children: "Already have an account? Sign in"
													}),
													(mode === "forgot" || mode === "reset" || mode === "2fa") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														className: "inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white",
														onClick: () => {
															setMode("in");
															setErr(null);
															setMsg(null);
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Sign In"]
													})
												]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-center text-[11px] leading-5 text-slate-600",
								children: "By continuing, you're stepping into your own little word universe."
							})
						]
					})
				})]
			})
		})]
	});
}
//#endregion
export { Login as component };
