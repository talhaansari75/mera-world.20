import { createFileRoute } from "@tanstack/react-router";
import { getPrisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { consumeRateLimit } from "@/lib/server/v3/rateLimit";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export const Route = createFileRoute("/api/multiplayer/chat-moderation")({
  server: { handlers: {
    POST: async ({ request }) => {
      try {
        const userId = await requireUserId();
        const limited = await consumeRateLimit(userId, "multiplayer_chat_moderation", 20, 60);
        if (!limited.allowed) return json({ error: "rate_limited" }, 429);
        const body = await request.json().catch(() => ({})) as Record<string, unknown>;
        const action = clean(body.action, 20);
        const roomId = clean(body.roomId, 80);
        const targetUserId = clean(body.targetUserId, 120);
        const messageId = clean(body.messageId, 120) || null;
        if (!roomId || !targetUserId) return json({ error: "roomId and targetUserId are required" }, 400);
        if (targetUserId === userId) return json({ error: "cannot_target_self" }, 400);
        const db = getPrisma();
        const member = await db.$queryRaw`select 1 from multiplayer_members where room_id=${roomId} and user_id=${userId} and is_bot=false limit 1`;
        const target = await db.$queryRaw`select 1 from multiplayer_members where room_id=${roomId} and user_id=${targetUserId} limit 1`;
        if (!member.length || !target.length) return json({ error: "not_room_member" }, 403);

        if (action === "block") {
          await db.$queryRaw`
            insert into multiplayer_chat_blocks(user_id, blocked_user_id)
            values(${userId}, ${targetUserId})
            on conflict(user_id, blocked_user_id) do nothing
          `;
          return json({ ok: true, action: "blocked" });
        }

        if (action === "unblock") {
          await db.$queryRaw`delete from multiplayer_chat_blocks where user_id=${userId} and blocked_user_id=${targetUserId}`;
          return json({ ok: true, action: "unblocked" });
        }

        if (action === "report") {
          const reasons = new Set(["spam", "abuse", "harassment", "scam", "other"]);
          const reason = clean(body.reason, 20);
          if (!reasons.has(reason)) return json({ error: "invalid_reason" }, 400);
          const details = clean(body.details, 500) || null;
          await db.$queryRaw`
            insert into multiplayer_chat_reports(id, room_id, reporter_user_id, target_user_id, message_id, reason, details)
            values(${crypto.randomUUID()}, ${roomId}, ${userId}, ${targetUserId}, ${messageId}, ${reason}, ${details})
          `;
          return json({ ok: true, action: "reported" });
        }

        return json({ error: "unsupported_action" }, 400);
      } catch (e) {
        return json({ error: e instanceof Error ? e.message : "chat_moderation_failed" }, 400);
      }
    }
  }
});
