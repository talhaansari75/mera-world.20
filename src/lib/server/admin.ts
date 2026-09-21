import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { isAdminUser } from "@/lib/v13/admin/access";

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!(await isAdminUser(context.userId))) throw new Error("Forbidden: admin access required");
    const sql = await getSql();

    await sql.query("insert into player_profile (user_id) select id from \"user\" u where not exists (select 1 from player_profile p where p.user_id = u.id)");
    await sql.query("insert into player_presence (user_id) select id from \"user\" u where not exists (select 1 from player_presence p where p.user_id = u.id)");

    const summary = await sql.query("select (select count(*) from \"user\") as users, (select count(*) from player_activity) as activities, (select count(*) from player_activity where occurred_at >= now() - interval '24 hours') as recent_activities, (select count(*) from player_presence where last_seen_at >= now() - interval '2 minutes') as active_now");
    const players = await sql.query("select p.player_number, u.id as user_id, u.name, u.email, coalesce(p.username, nullif(u.username, ''), split_part(u.email, '@', 1)) as username, u.\"createdAt\" as created_at, coalesce(pr.last_seen_at, u.\"updatedAt\") as last_seen_at, coalesce(pr.total_play_seconds, 0) as total_play_seconds, coalesce(pr.current_screen, '') as current_screen from \"user\" u join player_profile p on p.user_id = u.id left join player_presence pr on pr.user_id = u.id order by p.player_number asc");
    const activity = await sql.query("select a.id, p.player_number, u.name, coalesce(p.username, nullif(u.username, ''), split_part(u.email, '@', 1)) as username, u.email, a.event_type, a.screen, a.occurred_at, a.duration_seconds from player_activity a join \"user\" u on u.id = a.user_id join player_profile p on p.user_id = u.id order by a.occurred_at desc limit 100");

    return { ok: true as const, adminEmail: process.env.ADMIN_EMAIL?.trim() ?? "", summary: summary[0] ?? {}, players, activity };
  });

export const trackPlayerActivity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { eventType?: string; screen?: string; durationSeconds?: number }) => ({
    eventType: String(d.eventType ?? "heartbeat").slice(0, 40),
    screen: String(d.screen ?? "").slice(0, 80),
    durationSeconds: Math.max(0, Math.min(60, Math.floor(Number(d.durationSeconds ?? 0)))),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql.query("insert into player_profile (user_id) values ($1) on conflict (user_id) do nothing", [context.userId]);
    await sql.query("insert into player_presence (user_id, last_seen_at, total_play_seconds, current_screen) values ($1, now(), $2, $3) on conflict (user_id) do update set last_seen_at = now(), total_play_seconds = player_presence.total_play_seconds + excluded.total_play_seconds, current_screen = excluded.current_screen", [context.userId, data.durationSeconds, data.screen]);
    await sql.query("insert into player_activity (user_id, event_type, screen, duration_seconds) values ($1, $2, $3, $4)", [context.userId, data.eventType, data.screen || null, data.durationSeconds]);
    return { ok: true as const };
  });