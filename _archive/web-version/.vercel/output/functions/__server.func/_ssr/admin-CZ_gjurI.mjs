import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-DcaG3iKu.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Cmpo3hKv.mjs";
import { t as isAdminUser } from "./access-777wqO4P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CZ_gjurI.js
var getAdminDashboard_createServerFn_handler = createServerRpc({
	id: "36a0d6f1c97d92068a5f4a7080d0ecfcee4f0333332d0828686298ef670d6062",
	name: "getAdminDashboard",
	filename: "src/lib/server/admin.ts"
}, (opts) => getAdminDashboard.__executeServer(opts));
var getAdminDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminDashboard_createServerFn_handler, async ({ context }) => {
	if (!await isAdminUser(context.userId)) throw new Error("Forbidden: admin access required");
	const sql = await getSql();
	await sql.query("insert into player_profile (user_id) select id from \"user\" u where not exists (select 1 from player_profile p where p.user_id = u.id)");
	await sql.query("insert into player_presence (user_id) select id from \"user\" u where not exists (select 1 from player_presence p where p.user_id = u.id)");
	const summary = await sql.query("select (select count(*) from \"user\") as users, (select count(*) from player_activity) as activities, (select count(*) from player_activity where occurred_at >= now() - interval '24 hours') as recent_activities, (select count(*) from player_presence where last_seen_at >= now() - interval '2 minutes') as active_now");
	const players = await sql.query("select p.player_number, u.id as user_id, u.name, u.email, coalesce(p.username, nullif(u.username, ''), split_part(u.email, '@', 1)) as username, u.\"createdAt\" as created_at, coalesce(pr.last_seen_at, u.\"updatedAt\") as last_seen_at, coalesce(pr.total_play_seconds, 0) as total_play_seconds, coalesce(pr.current_screen, '') as current_screen from \"user\" u join player_profile p on p.user_id = u.id left join player_presence pr on pr.user_id = u.id order by p.player_number asc");
	const activity = await sql.query("select a.id, p.player_number, u.name, coalesce(p.username, nullif(u.username, ''), split_part(u.email, '@', 1)) as username, u.email, a.event_type, a.screen, a.occurred_at, a.duration_seconds from player_activity a join \"user\" u on u.id = a.user_id join player_profile p on p.user_id = u.id order by a.occurred_at desc limit 100");
	return {
		ok: true,
		adminEmail: process.env.ADMIN_EMAIL?.trim() ?? "",
		summary: summary[0] ?? {},
		players,
		activity
	};
});
var trackPlayerActivity_createServerFn_handler = createServerRpc({
	id: "84d65c1a78229829dd712d3429aa16a1b8a1de59327c6e6aae987486f7469c10",
	name: "trackPlayerActivity",
	filename: "src/lib/server/admin.ts"
}, (opts) => trackPlayerActivity.__executeServer(opts));
var trackPlayerActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	eventType: String(d.eventType ?? "heartbeat").slice(0, 40),
	screen: String(d.screen ?? "").slice(0, 80),
	durationSeconds: Math.max(0, Math.min(60, Math.floor(Number(d.durationSeconds ?? 0))))
})).handler(trackPlayerActivity_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql.query("insert into player_profile (user_id) values ($1) on conflict (user_id) do nothing", [context.userId]);
	await sql.query("insert into player_presence (user_id, last_seen_at, total_play_seconds, current_screen) values ($1, now(), $2, $3) on conflict (user_id) do update set last_seen_at = now(), total_play_seconds = player_presence.total_play_seconds + excluded.total_play_seconds, current_screen = excluded.current_screen", [
		context.userId,
		data.durationSeconds,
		data.screen
	]);
	await sql.query("insert into player_activity (user_id, event_type, screen, duration_seconds) values ($1, $2, $3, $4)", [
		context.userId,
		data.eventType,
		data.screen || null,
		data.durationSeconds
	]);
	return { ok: true };
});
//#endregion
export { getAdminDashboard_createServerFn_handler, trackPlayerActivity_createServerFn_handler };
