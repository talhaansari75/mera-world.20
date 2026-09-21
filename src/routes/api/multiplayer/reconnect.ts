import { createFileRoute } from "@tanstack/react-router";
import { getPrisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { tickBots } from "@/lib/multiplayer/botEngine";

const json = (d: unknown, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "content-type": "application/json" } });

export const Route = createFileRoute("/api/multiplayer/reconnect")({
  server: { handlers: {
    POST: async ({ request }) => {
      try {
        const userId = await requireUserId();
        const body = await request.json().catch(() => ({})) as { roomId?: string };
        const roomId = String(body.roomId ?? "").trim().slice(0, 80);
        if (!roomId) return json({ error: "roomId required" }, 400);
        const db = getPrisma();
        const membership = await db.$queryRaw`
          select room_id as "roomId", disconnected_at as "disconnectedAt"
          from multiplayer_members
          where room_id=\${roomId} and user_id=\${userId} and is_bot=false
          limit 1
        `;
        if (!membership.length) return json({ error: "Room not found" }, 404);
        await db.$queryRaw`update multiplayer_members set last_seen_at=now(),disconnected_at=null where room_id=\${roomId} and user_id=\${userId} and is_bot=false`;
        const matches = await db.$queryRaw`
          select match_id as "matchId", status, event_version as "eventVersion"
          from multiplayer_matches where room_id=\${roomId}
          order by started_at desc nulls last limit 1
        `;
        if (matches[0]?.matchId) await tickBots(matches[0].matchId);
        const events = matches[0]?.matchId
          ? await db.$queryRaw`select seq,user_id as "userId",event_type as "eventType",payload,created_at as "createdAt" from multiplayer_match_events where match_id=\${matches[0].matchId} order by seq asc limit 250`
          : [];
        return json({ ok: true, roomId, match: matches[0] ?? null, events });
      } catch (e) {
        return json({ error: e instanceof Error ? e.message : "reconnect_failed" }, 400);
      }
    }
  }
});
