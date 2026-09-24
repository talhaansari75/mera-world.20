import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as __exportAll } from "./ssr.mjs";
import { t as getPrisma } from "./prisma-u55HPJ6Y.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { b as puzzleForSeed } from "./levels-DBG2bxfj.mjs";
import { r as auth, t as requireUserId } from "./verify.server-CdYricdb.mjs";
import { l as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as consumeRateLimit } from "./rateLimit-BmPnMSIH.mjs";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B2-7B2IN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var AD_COOLDOWN_MS = 12e4;
var LAST_AD_KEY = "mwsj:last-h5-ad";
function adsEnabled() {
	return Boolean(void 0);
}
function canShowH5Ad() {
	if (typeof window === "undefined" || !adsEnabled() || typeof window.adBreak !== "function") return false;
	const last = Number(window.localStorage.getItem(LAST_AD_KEY) ?? 0);
	return !Number.isFinite(last) || Date.now() - last >= AD_COOLDOWN_MS;
}
function showH5Interstitial(name, onDone) {
	if (!canShowH5Ad()) return false;
	try {
		window.localStorage.setItem(LAST_AD_KEY, String(Date.now()));
		window.adBreak?.({
			type: "next",
			name,
			adBreakDone: () => onDone?.()
		});
		return true;
	} catch {
		return false;
	}
}
function AdSenseBootstrap() {
	(0, import_react.useEffect)(() => {
		if (!adsEnabled() || document.querySelector("script[data-mwsj-adsense=\"h5\"]")) return;
	}, []);
	return null;
}
var styles_default = "/assets/styles-D7v0JdmE.css";
var APP_NAME = "Mera Word Search Journey";
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#ffffff"
			},
			{
				name: "description",
				content: "A quiet atlas of hidden words — offline word search with worlds, companions, and a traveler's bazaar."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSenseBootstrap, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$2 = () => import("./routes-BqYI2zTr.mjs");
var Route$9 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./login-Bt42S3mC.mjs");
var Route$8 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./shop-CGx5mu5K.mjs");
var Route$7 = createFileRoute("/shop")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$6 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
function multiplayerPuzzle(level, mode, seed) {
	const safe = [
		"classic",
		"timed",
		"blitz"
	].includes(mode) ? mode : "classic";
	return puzzleForSeed(Math.max(1, Math.min(2e3, level)), safe, seed, "en");
}
function sameCells(a, b) {
	return Array.isArray(a) && a.length === b.length && a.every((x, i) => Array.isArray(x) && x.length === 2 && Number(x[0]) === b[i][0] && Number(x[1]) === b[i][1]);
}
async function settleMatch(matchId) {
	return getPrisma().$transaction(async (tx) => {
		const locked = await tx.$queryRaw`select match_id,room_id,status,settled_at from multiplayer_matches where match_id=${matchId} for update`;
		if (!locked.length) return { settled: false };
		if (locked[0].settled_at) return { settled: true };
		const rows = await tx.$queryRaw`select user_id,is_bot,score from multiplayer_members where room_id=${locked[0].room_id} order by score desc,user_id asc`;
		if (!rows.length) return { settled: false };
		await tx.$queryRaw`insert into multiplayer_match_results(match_id,user_id,rank,score,is_bot) select ${matchId},user_id,row_number() over(order by score desc,user_id asc),score,is_bot from multiplayer_members where room_id=${locked[0].room_id} on conflict(match_id,user_id) do update set rank=excluded.rank,score=excluded.score,is_bot=excluded.is_bot`;
		const humans = rows.filter((r) => !r.is_bot), humanCount = humans.length;
		if (humanCount >= 2) for (let i = 0; i < humans.length; i++) {
			const h = humans[i];
			const rank = i + 1;
			const delta = rank === 1 ? 20 : rank === 2 ? 5 : -15;
			await tx.$queryRaw`insert into multiplayer_ratings(user_id,rating,wins,losses,draws,games,updated_at) values(${h.user_id},1000+${delta},${rank === 1 ? 1 : 0},${rank === 1 ? 0 : 1},0,1,now()) on conflict(user_id) do update set rating=greatest(100,multiplayer_ratings.rating+${delta}),wins=multiplayer_ratings.wins+${rank === 1 ? 1 : 0},losses=multiplayer_ratings.losses+${rank === 1 ? 0 : 1},games=multiplayer_ratings.games+1,updated_at=now()`;
		}
		const winner = rows[0]?.is_bot ? null : rows[0]?.user_id;
		await tx.$queryRaw`update multiplayer_matches set status=case when status in ('live','waiting','countdown') then 'finished' else status end,finished_at=coalesce(finished_at,now()),winner_user_id=coalesce(winner_user_id,${winner}),settled_at=now(),event_version=event_version+1 where match_id=${matchId}`;
		await tx.$queryRaw`update multiplayer_rooms set status='finished',updated_at=now(),state_json=jsonb_set(coalesce(state_json,'{}'::jsonb),'{phase}','"finished"'::jsonb) where room_id=${locked[0].room_id}`;
		return {
			settled: true,
			winner,
			ranked: humanCount >= 2
		};
	});
}
async function tickBots(matchId) {
	const db = getPrisma();
	const m = await db.$queryRaw`select match_id,room_id,status,mode,level_id,puzzle_seed,started_at,duration_seconds from multiplayer_matches where match_id=${matchId} for update`;
	if (!m.length || m[0].status !== "live" || !m[0].started_at) return;
	if (Date.now() > new Date(m[0].started_at).getTime() + Number(m[0].duration_seconds) * 1e3) {
		await settleMatch(matchId);
		return;
	}
	const puzzle = multiplayerPuzzle(Number(m[0].level_id), String(m[0].mode), Number(m[0].puzzle_seed));
	const bots = await db.$queryRaw`select user_id,bot_skill from multiplayer_members where room_id=${m[0].room_id} and is_bot=true`;
	for (const bot of bots) {
		const skill = String(bot.bot_skill || "steady"), delay = skill === "expert" ? 3500 : skill === "steady" ? 7500 : 1e4;
		const target = Math.min(puzzle.words.length, Math.floor((Date.now() - new Date(m[0].started_at).getTime()) / delay));
		if (target < 1) continue;
		const found = await db.$queryRaw`select word from multiplayer_found_words where match_id=${matchId} and user_id=${bot.user_id} order by created_at`;
		if (found.length >= target) continue;
		const word = puzzle.words.find((w) => !found.some((x) => x.word === w));
		if (!word) continue;
		await db.$queryRaw`insert into multiplayer_found_words(match_id,user_id,word) values(${matchId},${bot.user_id},${word}) on conflict do nothing`;
		const count = await db.$queryRaw`select count(*)::int as n from multiplayer_found_words where match_id=${matchId} and user_id=${bot.user_id}`;
		const n = Number(count[0].n), score = n * 100 + Math.max(0, word.length - 3) * 20;
		await db.$queryRaw`update multiplayer_members set found_words=(select coalesce(jsonb_agg(word order by word),'[]'::jsonb) from multiplayer_found_words where match_id=${matchId} and user_id=${bot.user_id}),progress=${Math.min(100, Math.floor(n / puzzle.words.length * 100))},score=${score},combo=${n},last_seen_at=now() where room_id=${m[0].room_id} and user_id=${bot.user_id} and is_bot=true`;
		await db.$queryRaw`insert into multiplayer_match_event_counters(match_id,next_seq) values(${matchId},1) on conflict(match_id) do nothing`;
		const c = await db.$queryRaw`update multiplayer_match_event_counters set next_seq=next_seq+1 where match_id=${matchId} returning next_seq-1 as seq`;
		await db.$queryRaw`insert into multiplayer_match_events(match_id,seq,user_id,event_type,payload) values(${matchId},${Number(c[0].seq)},${bot.user_id},'bot_word_found',${JSON.stringify({ word })}::jsonb)`;
		await db.$queryRaw`update multiplayer_matches set event_version=event_version+1 where match_id=${matchId}`;
	}
}
var json$3 = (d, s = 200) => new Response(JSON.stringify(d), {
	status: s,
	headers: { "content-type": "application/json" }
});
var text = (v, max = 240) => typeof v === "string" ? v.trim().slice(0, max) : "";
var Route$5 = createFileRoute("/api/multiplayer/action")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const userId = await requireUserId();
		if (!(await consumeRateLimit(userId, "multiplayer_action", 120, 60)).allowed) return json$3({ error: "rate_limited" }, 429);
		const b = await request.json().catch(() => ({})), db = getPrisma();
		const roomId = text(b.roomId, 80), action = text(b.action, 30), matchId = text(b.matchId, 80), payload = b.payload && typeof b.payload === "object" ? b.payload : {};
		if (!roomId) return json$3({ error: "roomId required" }, 400);
		if (!(await db.$queryRaw`select room_id from multiplayer_rooms where room_id=${roomId} and exists(select 1 from multiplayer_members where room_id=${roomId} and user_id=${userId} and is_bot=false)`).length) return json$3({ error: "Room not found" }, 404);
		if (action === "heartbeat") {
			await tickBots((await db.$queryRaw`select match_id from multiplayer_matches where room_id=${roomId} limit 1`)[0]?.match_id);
			await db.$queryRaw`update multiplayer_members set last_seen_at=now(),disconnected_at=null where room_id=${roomId} and user_id=${userId} and is_bot=false`;
			return json$3({ ok: true });
		}
		if (action === "chat") {
			const message = text(payload.message);
			if (!message) return json$3({ error: "Empty message" }, 400);
			await db.$queryRaw`insert into multiplayer_chat(room_id,user_id,message) values(${roomId},${userId},${message})`;
			return json$3({ ok: true });
		}
		if (action === "ready") {
			await db.$queryRaw`update multiplayer_members set ready=true,last_seen_at=now() where room_id=${roomId} and user_id=${userId} and is_bot=false`;
			const m = await db.$queryRaw`select match_id from multiplayer_matches where room_id=${roomId} and status='waiting' limit 1`;
			if (m.length) {
				const p = await db.$queryRaw`select count(*)::int as n from multiplayer_members where room_id=${roomId} and ready=false`;
				if (Number(p[0].n) === 0) {
					await db.$queryRaw`update multiplayer_matches set status='live',started_at=coalesce(started_at,now()) where match_id=${m[0].match_id} and status='waiting'`;
					await db.$queryRaw`update multiplayer_rooms set status='playing',updated_at=now(),state_json=jsonb_set(coalesce(state_json,'{}'::jsonb),'{phase}','"live"'::jsonb) where room_id=${roomId}`;
				}
			}
			return json$3({ ok: true });
		}
		if (action !== "word_found") return json$3({ error: "Unsupported match action" }, 400);
		if (!matchId) return json$3({ error: "matchId required" }, 400);
		const match = await db.$queryRaw`select match_id,status,mode,level_id,puzzle_seed,started_at,duration_seconds from multiplayer_matches where match_id=${matchId} and room_id=${roomId} limit 1`;
		if (!match.length) return json$3({ error: "Match not found" }, 404);
		if (match[0].status !== "live") return json$3({ error: "Match is not live" }, 409);
		const started = new Date(match[0].started_at).getTime();
		if (!Number.isFinite(started)) return json$3({ error: "Match start time invalid" }, 500);
		if (Date.now() > started + Number(match[0].duration_seconds) * 1e3) {
			await settleMatch(matchId);
			return json$3({
				error: "Match time expired",
				settled: true
			}, 409);
		}
		const word = text(payload.word, 80).toUpperCase(), cells = payload.cells, puzzle = multiplayerPuzzle(Number(match[0].level_id), String(match[0].mode), Number(match[0].puzzle_seed));
		const placement = puzzle.placements.find((p) => p.word === word);
		if (!placement || !sameCells(cells, placement.cells)) return json$3({ error: "Invalid word selection" }, 400);
		if (!(await db.$queryRaw`insert into multiplayer_found_words(match_id,user_id,word) values(${matchId},${userId},${word}) on conflict do nothing returning word`).length) return json$3({ error: "Word already found" }, 409);
		const countRows = await db.$queryRaw`select count(*)::int as n from multiplayer_found_words where match_id=${matchId} and user_id=${userId}`;
		const count = Number(countRows[0]?.n || 0), score = count * 100 + Math.max(0, word.length - 3) * 20, progress = Math.min(100, Math.floor(count / puzzle.words.length * 100));
		await db.$queryRaw`update multiplayer_members set found_words=(select coalesce(jsonb_agg(word order by word),'[]'::jsonb) from multiplayer_found_words where match_id=${matchId} and user_id=${userId}),progress=${progress},score=${score},combo=${count},last_seen_at=now() where room_id=${roomId} and user_id=${userId} and is_bot=false`;
		await db.$transaction(async (tx) => {
			await tx.$queryRaw`insert into multiplayer_match_event_counters(match_id,next_seq) values(${matchId},1) on conflict(match_id) do nothing`;
			const c = await tx.$queryRaw`update multiplayer_match_event_counters set next_seq=next_seq+1 where match_id=${matchId} returning next_seq-1 as seq`;
			const seq = Number(c[0].seq);
			await tx.$queryRaw`insert into multiplayer_match_events(match_id,seq,user_id,event_type,payload) values(${matchId},${seq},${userId},'word_found',${JSON.stringify({ word })}::jsonb)`;
			await tx.$queryRaw`update multiplayer_matches set event_version=event_version+1 where match_id=${matchId}`;
		});
		if (count >= puzzle.words.length) {
			await settleMatch(matchId);
			await db.$queryRaw`update multiplayer_rooms set status='finished',updated_at=now(),state_json=jsonb_set(coalesce(state_json,'{}'::jsonb),'{phase}','"finished"'::jsonb) where room_id=${roomId}`;
		}
		return json$3({
			ok: true,
			found: count,
			total: puzzle.words.length,
			score
		});
	} catch (e) {
		return json$3({ error: e instanceof Error ? e.message : "Multiplayer action failed" }, 400);
	}
} } } });
var BOT_PROFILES = [
	{
		id: "pk",
		country: "Pakistan",
		countryCode: "PK",
		names: [
			"Aisha",
			"Imran",
			"Abbas",
			"Hina",
			"Hamza",
			"Mariam"
		],
		avatar: "moon",
		skill: "steady"
	},
	{
		id: "in",
		country: "India",
		countryCode: "IN",
		names: [
			"Aarav",
			"Ananya",
			"Kabir",
			"Priya",
			"Rohan",
			"Meera"
		],
		avatar: "lotus",
		skill: "steady"
	},
	{
		id: "bd",
		country: "Bangladesh",
		countryCode: "BD",
		names: [
			"Nusrat",
			"Arif",
			"Sadia",
			"Tanvir",
			"Mim",
			"Fahim"
		],
		avatar: "star",
		skill: "casual"
	},
	{
		id: "ae",
		country: "UAE",
		countryCode: "AE",
		names: [
			"Noor",
			"Omar",
			"Laila",
			"Zayed",
			"Maya",
			"Sami"
		],
		avatar: "sun",
		skill: "expert"
	},
	{
		id: "sa",
		country: "Saudi Arabia",
		countryCode: "SA",
		names: [
			"Noura",
			"Faisal",
			"Sara",
			"Omar",
			"Lina",
			"Khalid"
		],
		avatar: "desert",
		skill: "steady"
	},
	{
		id: "tr",
		country: "Türkiye",
		countryCode: "TR",
		names: [
			"Elif",
			"Emir",
			"Zeynep",
			"Kerem",
			"Derya",
			"Arda"
		],
		avatar: "crescent",
		skill: "steady"
	},
	{
		id: "gb",
		country: "United Kingdom",
		countryCode: "GB",
		names: [
			"Olivia",
			"James",
			"Amelia",
			"Harry",
			"Sophie",
			"Jack"
		],
		avatar: "crown",
		skill: "expert"
	},
	{
		id: "us",
		country: "United States",
		countryCode: "US",
		names: [
			"Emma",
			"Liam",
			"Mia",
			"Noah",
			"Ava",
			"Ethan"
		],
		avatar: "comet",
		skill: "expert"
	},
	{
		id: "ca",
		country: "Canada",
		countryCode: "CA",
		names: [
			"Olivia",
			"Lucas",
			"Chloe",
			"Evan",
			"Maya",
			"Leo"
		],
		avatar: "aurora",
		skill: "steady"
	},
	{
		id: "au",
		country: "Australia",
		countryCode: "AU",
		names: [
			"Isla",
			"Jack",
			"Ruby",
			"Lachlan",
			"Mia",
			"Noah"
		],
		avatar: "wave",
		skill: "casual"
	},
	{
		id: "jp",
		country: "Japan",
		countryCode: "JP",
		names: [
			"Yuki",
			"Hana",
			"Ren",
			"Aoi",
			"Sora",
			"Mei"
		],
		avatar: "sakura",
		skill: "expert"
	},
	{
		id: "kr",
		country: "South Korea",
		countryCode: "KR",
		names: [
			"Minji",
			"Jisoo",
			"Jiho",
			"Sora",
			"Hana",
			"Jun"
		],
		avatar: "neon",
		skill: "expert"
	},
	{
		id: "br",
		country: "Brazil",
		countryCode: "BR",
		names: [
			"Ana",
			"Lucas",
			"Beatriz",
			"Mateus",
			"Julia",
			"Rafael"
		],
		avatar: "sunset",
		skill: "casual"
	},
	{
		id: "ng",
		country: "Nigeria",
		countryCode: "NG",
		names: [
			"Ada",
			"Emeka",
			"Amara",
			"Tunde",
			"Zainab",
			"Chidi"
		],
		avatar: "ember",
		skill: "steady"
	},
	{
		id: "za",
		country: "South Africa",
		countryCode: "ZA",
		names: [
			"Amahle",
			"Liam",
			"Thandi",
			"Sibusiso",
			"Mia",
			"Neo"
		],
		avatar: "star",
		skill: "steady"
	},
	{
		id: "de",
		country: "Germany",
		countryCode: "DE",
		names: [
			"Lena",
			"Jonas",
			"Mia",
			"Felix",
			"Lea",
			"Paul"
		],
		avatar: "eclipse",
		skill: "expert"
	},
	{
		id: "fr",
		country: "France",
		countryCode: "FR",
		names: [
			"Chloé",
			"Louis",
			"Emma",
			"Hugo",
			"Camille",
			"Noah"
		],
		avatar: "lumiere",
		skill: "steady"
	},
	{
		id: "es",
		country: "Spain",
		countryCode: "ES",
		names: [
			"Lucía",
			"Mateo",
			"Sofía",
			"Álvaro",
			"Carmen",
			"Diego"
		],
		avatar: "sol",
		skill: "casual"
	}
];
function botForCountry(code, seed = 0) {
	const p = BOT_PROFILES.filter((x) => x.countryCode === code.toUpperCase());
	const pool = p.length ? p : BOT_PROFILES;
	return pool[Math.abs(seed) % pool.length];
}
function botDisplayName(bot, seed = 0) {
	return bot.names[Math.abs(seed) % bot.names.length];
}
var json$2 = (d, s = 200) => new Response(JSON.stringify(d), {
	status: s,
	headers: { "content-type": "application/json" }
});
var int = (v, min, max, def) => {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isInteger(n) && n >= min && n <= max ? n : def;
};
var Route$4 = createFileRoute("/api/multiplayer/match")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const userId = await requireUserId();
		if (!(await consumeRateLimit(userId, "multiplayer_match_create", 10, 60)).allowed) return json$2({ error: "rate_limited" }, 429);
		const b = await request.json().catch(() => ({}));
		const cc = String(b.countryCode || "PK").trim().slice(0, 2).toUpperCase() || "PK";
		const maxPlayers = int(b.maxPlayers, 2, 4, 2), worldId = int(b.worldId, 1, 6, 1), levelId = int(b.levelId, 1, 2e3, 1);
		const mode = [
			"classic",
			"blitz",
			"timed"
		].includes(String(b.mode)) ? String(b.mode) : "classic";
		const defaultDuration = mode === "blitz" ? 90 : 180, duration = int(b.durationSeconds, 30, 600, defaultDuration);
		const db = getPrisma(), roomId = randomUUID(), matchId = randomUUID(), seed = Math.floor(Math.random() * 2147483647);
		await db.$transaction(async (tx) => {
			await tx.$queryRaw`insert into multiplayer_rooms(room_id,host_user_id,mode,status,max_players,state_json) values(${roomId},${userId},${mode},'open',${maxPlayers},jsonb_build_object('matchId',${matchId},'phase','lobby'))`;
			await tx.$queryRaw`insert into multiplayer_matches(match_id,room_id,status,mode,puzzle_seed,world_id,duration_seconds,level_id) values(${matchId},${roomId},'waiting',${mode},${seed},${worldId},${duration},${levelId})`;
			await tx.$queryRaw`insert into multiplayer_members(room_id,user_id,human_user_id,display_name,role,country_code,is_bot,avatar_id,ready,last_seen_at) values(${roomId},${userId},${userId},'Traveler','player',${cc},false,'traveler',false,now())`;
			const bot = botForCountry(cc, seed);
			for (let i = 1; i < maxPlayers; i++) {
				const botId = "bot:" + randomUUID();
				await tx.$queryRaw`insert into multiplayer_members(room_id,user_id,display_name,role,country_code,is_bot,avatar_id,bot_profile_id,bot_skill,ready,last_seen_at) values(${roomId},${botId},${botDisplayName(bot, i + seed)},'bot',${bot.countryCode},true,${bot.avatar},${bot.id + "-" + i},${bot.skill},true,now())`;
			}
		});
		return json$2({
			ok: true,
			roomId,
			matchId,
			mode,
			maxPlayers,
			phase: "lobby",
			botFill: true
		});
	} catch (e) {
		return json$2({ error: e instanceof Error ? e.message : "Matchmaking failed" }, 400);
	}
} } } });
var json$1 = (d, s = 200) => new Response(JSON.stringify(d), {
	status: s,
	headers: { "content-type": "application/json" }
});
var Route$3 = createFileRoute("/api/multiplayer/state")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const userId = await requireUserId(), url = new URL(request.url), roomId = url.searchParams.get("roomId"), since = Math.max(0, Number(url.searchParams.get("since") || 0));
		if (!roomId) return json$1({ error: "roomId required" }, 400);
		const db = getPrisma();
		const room = await db.$queryRaw`select r.room_id as "roomId",r.mode,r.status,r.max_players as "maxPlayers",r.state_json as "state",m.match_id as "matchId",m.status as "matchStatus",m.puzzle_seed as "puzzleSeed",m.world_id as "worldId",m.duration_seconds as "durationSeconds",m.started_at as "startedAt",m.finished_at as "finishedAt",m.winner_user_id as "winnerUserId",m.event_version as "eventVersion" from multiplayer_rooms r join multiplayer_matches m on m.room_id=r.room_id where r.room_id=${roomId} and exists(select 1 from multiplayer_members where room_id=${roomId} and user_id=${userId} and is_bot=false) limit 1`;
		if (!room.length) return json$1({ error: "Room not found" }, 404);
		const matchId = room[0].matchId;
		const members = await db.$queryRaw`select display_name as "displayName",country_code as "countryCode",is_bot as "isBot",avatar_id as "avatarId",score,progress,combo,ready,last_seen_at as "lastSeenAt",bot_skill as "botSkill",found_words as "foundWords" from multiplayer_members where room_id=${roomId} order by score desc,user_id asc`;
		const messages = await db.$queryRaw`select user_id as "userId",message,created_at as "createdAt" from multiplayer_chat where room_id=${roomId} order by created_at desc limit 50`;
		const events = await db.$queryRaw`select seq,user_id as "userId",event_type as "eventType",payload,created_at as "createdAt" from multiplayer_match_events where match_id=${matchId} and seq>${Number.isInteger(since) ? since : 0} order by seq asc limit 100`;
		return json$1({
			room: room[0],
			members,
			messages: messages.reverse(),
			events,
			nextSince: events.length ? Number(events[events.length - 1].seq) : since
		});
	} catch (e) {
		return json$1({ error: e instanceof Error ? e.message : "State failed" }, 400);
	}
} } } });
var PRODUCTS = {
	starter_gems: {
		name: "Starter Gems",
		priceUsd: "1.99",
		amountAtomic: "1990000",
		diamonds: 250
	},
	adventurer_gems: {
		name: "Adventurer Gems",
		priceUsd: "4.99",
		amountAtomic: "4990000",
		diamonds: 700
	},
	legendary_gems: {
		name: "Legendary Gems",
		priceUsd: "9.99",
		amountAtomic: "9990000",
		diamonds: 1600
	}
};
var CHAIN_ID = Number(process.env.BASE_CHAIN_ID || 84532);
var TOKEN_ADDRESS = (process.env.BASE_USDC_ADDRESS || "").trim();
var RECIPIENT_ADDRESS = (process.env.BASE_PAYMENT_RECIPIENT || "").trim();
var RPC_URL = (process.env.BASE_RPC_URL || (CHAIN_ID === 8453 ? "https://mainnet.base.org" : "https://sepolia.base.org")).trim();
function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "content-type": "application/json" }
	});
}
function bearer(request) {
	const value = request.headers.get("authorization");
	return value?.startsWith("Bearer ") ? value.slice(7) : void 0;
}
function assertAddress(value) {
	if (!/^0x[0-9a-fA-F]{40}$/.test(value)) throw new Error("Invalid address");
}
function product(productId) {
	const item = PRODUCTS[productId];
	if (!item) throw new Error("Unknown product");
	return item;
}
async function rpc(method, params) {
	const response = await fetch(RPC_URL, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method,
			params
		})
	});
	if (!response.ok) throw new Error("Blockchain RPC unavailable");
	const body = await response.json();
	if (body.error) throw new Error(body.error.message || "Blockchain RPC error");
	return body.result;
}
var TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
var Route$2 = createFileRoute("/api/payments/base")({ server: { handlers: {
	GET: async ({ request }) => {
		try {
			const userId = await requireUserId(bearer(request));
			return json({
				chainId: CHAIN_ID,
				tokenAddress: TOKEN_ADDRESS,
				recipientAddress: RECIPIENT_ADDRESS,
				products: Object.entries(PRODUCTS).map(([id, p]) => ({
					id,
					...p
				})),
				userId
			});
		} catch (error) {
			return json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
		}
	},
	POST: async ({ request }) => {
		try {
			const userId = await requireUserId(bearer(request));
			const body = await request.json();
			const db = getPrisma();
			if (body.action === "create") {
				if (!TOKEN_ADDRESS || !RECIPIENT_ADDRESS) return json({ error: "Blockchain payments are not configured." }, 503);
				assertAddress(TOKEN_ADDRESS);
				assertAddress(RECIPIENT_ADDRESS);
				if (!body.payerAddress) return json({ error: "payerAddress is required" }, 400);
				assertAddress(body.payerAddress);
				const item = product(String(body.productId || ""));
				const id = randomUUID();
				const expiresAt = new Date(Date.now() + 9e5);
				await db.$queryRaw`
            insert into blockchain_payment_intents
              (id,user_id,product_id,chain_id,token_address,recipient_address,payer_address,amount_atomic,status,expires_at)
            values
              (${id},${userId},${body.productId},${CHAIN_ID},${TOKEN_ADDRESS},${RECIPIENT_ADDRESS},${String(body.payerAddress).toLowerCase()},${item.amountAtomic},'pending',${expiresAt})
          `;
				return json({
					intentId: id,
					chainId: CHAIN_ID,
					tokenAddress: TOKEN_ADDRESS,
					recipientAddress: RECIPIENT_ADDRESS,
					amountAtomic: item.amountAtomic,
					product: item,
					expiresAt
				});
			}
			if (body.action === "verify") {
				if (!body.intentId || !body.txHash) return json({ error: "intentId and txHash are required" }, 400);
				if (!/^0x[0-9a-fA-F]{64}$/.test(body.txHash)) return json({ error: "Invalid transaction hash" }, 400);
				const intent = (await db.$queryRaw`select * from blockchain_payment_intents where id = ${body.intentId} and user_id = ${userId} limit 1`)[0];
				if (!intent) return json({ error: "Payment intent not found" }, 404);
				if (intent.status === "paid") return json({
					ok: true,
					status: "paid",
					txHash: intent.tx_hash
				});
				if (new Date(String(intent.expires_at)).getTime() < Date.now()) return json({ error: "Payment intent expired" }, 400);
				const networkHex = await rpc("eth_chainId", []);
				if (Number.parseInt(String(networkHex), 16) !== Number(intent.chain_id)) return json({ error: "Wrong network for payment intent" }, 400);
				const tx = await rpc("eth_getTransactionByHash", [body.txHash]);
				const receipt = await rpc("eth_getTransactionReceipt", [body.txHash]);
				if (!tx || !receipt) return json({ error: "Transaction not found yet" }, 202);
				if (tx.blockHash === null || receipt.status !== "0x1") return json({ error: "Transaction is not confirmed successfully" }, 400);
				if (String(tx.to || "").toLowerCase() !== String(intent.token_address).toLowerCase()) return json({ error: "Transaction did not call the configured USDC contract" }, 400);
				const from = String(tx.from || "").toLowerCase();
				if (from !== String(intent.payer_address || "").toLowerCase()) return json({ error: "Transaction sender does not match the payment intent" }, 400);
				const wantedRecipient = String(intent.recipient_address).toLowerCase().replace(/^0x/, "");
				const wantedAmount = BigInt(String(intent.amount_atomic)).toString(16).padStart(64, "0").toLowerCase();
				const recipientTopic = wantedRecipient.padStart(64, "0").toLowerCase();
				let matched = false;
				for (const log of receipt.logs ?? []) {
					const topics = log.topics ?? [];
					if (String(log.address).toLowerCase() !== String(intent.token_address).toLowerCase()) continue;
					if (String(topics[0]).toLowerCase() !== TRANSFER_TOPIC) continue;
					if (String(topics[2] || "").toLowerCase().replace(/^0x/, "").padStart(64, "0") !== recipientTopic) continue;
					if (String(topics[1] || "").toLowerCase().replace(/^0x/, "").padStart(64, "0") !== from.slice(2).padStart(64, "0")) continue;
					if (String(log.data || "").toLowerCase().replace(/^0x/, "").padStart(64, "0") !== wantedAmount) continue;
					matched = true;
					break;
				}
				if (!matched) return json({ error: "Payment amount, sender or recipient does not match the intent" }, 400);
				const item = product(String(intent.product_id));
				await db.$transaction(async (txDb) => {
					if (!(await txDb.$queryRaw`
              insert into blockchain_currency_ledger (user_id, intent_id, tx_hash, currency, amount)
              values (${userId}, ${body.intentId}, ${body.txHash}, 'diamonds', ${item.diamonds})
              on conflict (tx_hash) do nothing
              returning id
            `).length) throw new Error("This transaction has already been credited.");
					if (!(await txDb.$queryRaw`
              update player_saves
              set save_json = jsonb_set(
                save_json::jsonb,
                '{diamonds}',
                to_jsonb(coalesce((save_json::jsonb->>'diamonds')::integer, 0) + ${item.diamonds}),
                true
              )::text,
              updated_at = now(),
              revision = revision + 1
              where user_id = ${userId}
              returning user_id
            `).length) throw new Error("Cloud save is not initialized for this account.");
					await txDb.$queryRaw`
              update blockchain_payment_intents
              set status='paid', tx_hash=${body.txHash}, paid_at=now()
              where id=${body.intentId} and status='pending'
            `;
					await txDb.purchaseReceipt.upsert({
						where: { provider_externalId: {
							provider: "base-usdc",
							externalId: body.txHash
						} },
						create: {
							userId,
							provider: "base-usdc",
							externalId: body.txHash,
							productId: intent.product_id,
							amountMinor: Math.round(Number(item.priceUsd) * 100),
							currency: "USD",
							status: "verified",
							rawJson: {
								chainId: CHAIN_ID,
								txHash: body.txHash,
								from,
								tokenAddress: TOKEN_ADDRESS
							}
						},
						update: {
							status: "verified",
							userId,
							productId: intent.product_id,
							amountMinor: Math.round(Number(item.priceUsd) * 100),
							currency: "USD"
						}
					});
					await txDb.entitlement.upsert({
						where: { userId_productId: {
							userId,
							productId: intent.product_id
						} },
						create: {
							userId,
							productId: intent.product_id,
							active: true,
							source: "purchase",
							expiresAt: null
						},
						update: {
							active: true,
							source: "purchase",
							expiresAt: null
						}
					});
				});
				return json({
					ok: true,
					status: "paid",
					txHash: body.txHash,
					product: item
				});
			}
			return json({ error: "Unknown action" }, 400);
		} catch (error) {
			return json({ error: error instanceof Error ? error.message : "Payment request failed" }, 400);
		}
	}
} } });
var HmacPaymentProvider = class {
	secret;
	provider;
	constructor(secret, provider) {
		this.secret = secret;
		this.provider = provider;
	}
	async verifyWebhook(rawBody, signature) {
		if (!signature || !this.secret) return null;
		const expected = createHmac("sha256", this.secret).update(rawBody).digest("hex");
		try {
			if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
		} catch {
			return null;
		}
		let x;
		try {
			x = JSON.parse(rawBody);
		} catch {
			return null;
		}
		if (String(x.provider ?? this.provider) !== this.provider || !x.userId || !x.externalId || !x.productId) return null;
		return {
			provider: this.provider,
			externalId: String(x.externalId).slice(0, 128),
			productId: String(x.productId).slice(0, 128),
			amountMinor: Math.max(0, Math.min(1e8, Math.floor(Number(x.amountMinor) || 0))),
			currency: String(x.currency ?? "USD").toUpperCase().slice(0, 8),
			raw: x,
			userId: String(x.userId).slice(0, 128),
			expiresAt: x.expiresAt ?? null,
			status: x.status === "refunded" ? "refunded" : "verified"
		};
	}
};
var Route$1 = createFileRoute("/api/payments/webhook")({ server: { handlers: { POST: async ({ request }) => {
	const raw = await request.text();
	const providerName = process.env.PAYMENT_PROVIDER?.trim();
	const secret = process.env.PAYMENT_WEBHOOK_SECRET?.trim();
	if (!providerName || !secret) return new Response(JSON.stringify({
		ok: false,
		error: "Payment provider is not configured."
	}), {
		status: 503,
		headers: { "content-type": "application/json" }
	});
	const verified = await new HmacPaymentProvider(secret, providerName).verifyWebhook(raw, request.headers.get("x-payment-signature") ?? request.headers.get("x-signature") ?? void 0);
	if (!verified) return new Response(JSON.stringify({
		ok: false,
		error: "Invalid webhook signature or payload."
	}), {
		status: 401,
		headers: { "content-type": "application/json" }
	});
	await getPrisma().$transaction(async (tx) => {
		if (verified.status === "refunded") {
			await tx.purchaseReceipt.updateMany({
				where: {
					provider: verified.provider,
					externalId: verified.externalId
				},
				data: {
					status: "refunded",
					rawJson: verified.raw
				}
			});
			await tx.entitlement.updateMany({
				where: {
					userId: verified.userId,
					productId: verified.productId
				},
				data: {
					active: false,
					source: "refund"
				}
			});
			return;
		}
		const currency = [
			"USD",
			"EUR",
			"GBP",
			"PKR"
		].includes(verified.currency) ? verified.currency : "USD";
		await tx.purchaseReceipt.upsert({
			where: { provider_externalId: {
				provider: verified.provider,
				externalId: verified.externalId
			} },
			create: {
				userId: verified.userId,
				provider: verified.provider,
				externalId: verified.externalId,
				productId: verified.productId,
				amountMinor: verified.amountMinor,
				currency,
				status: "verified",
				rawJson: verified.raw
			},
			update: {
				status: "verified",
				rawJson: verified.raw,
				userId: verified.userId,
				productId: verified.productId,
				amountMinor: verified.amountMinor,
				currency
			}
		});
		await tx.entitlement.upsert({
			where: { userId_productId: {
				userId: verified.userId,
				productId: verified.productId
			} },
			create: {
				userId: verified.userId,
				productId: verified.productId,
				active: true,
				source: "purchase",
				expiresAt: verified.expiresAt ? new Date(verified.expiresAt) : null
			},
			update: {
				active: true,
				source: "purchase",
				expiresAt: verified.expiresAt ? new Date(verified.expiresAt) : null
			}
		});
	});
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { "content-type": "application/json" }
	});
} } } });
var rootRouteChildren = {
	IndexRoute: Route$9.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	LoginRoute: Route$8.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$10
	}),
	ShopRoute: Route$7.update({
		id: "/shop",
		path: "/shop",
		getParentRoute: () => Route$10
	}),
	ApiAuthSplatRoute: Route$6.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$10
	}),
	ApiMultiplayerActionRoute: Route$5.update({
		id: "/api/multiplayer/action",
		path: "/api/multiplayer/action",
		getParentRoute: () => Route$10
	}),
	ApiMultiplayerMatchRoute: Route$4.update({
		id: "/api/multiplayer/match",
		path: "/api/multiplayer/match",
		getParentRoute: () => Route$10
	}),
	ApiMultiplayerStateRoute: Route$3.update({
		id: "/api/multiplayer/state",
		path: "/api/multiplayer/state",
		getParentRoute: () => Route$10
	}),
	ApiPaymentsBaseRoute: Route$2.update({
		id: "/api/payments/base",
		path: "/api/payments/base",
		getParentRoute: () => Route$10
	}),
	ApiPaymentsWebhookRoute: Route$1.update({
		id: "/api/payments/webhook",
		path: "/api/payments/webhook",
		getParentRoute: () => Route$10
	})
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { showH5Interstitial as r, router_exports as t };
