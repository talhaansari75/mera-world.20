import { getPrisma } from "@/lib/db";

export async function flagMultiplayerAnomaly(input: {
  matchId: string;
  userId: string;
  flagType: string;
  severity: "low" | "medium" | "high";
  evidence?: Record<string, unknown>;
}) {
  const db = getPrisma();
  await db.$queryRaw`
    insert into multiplayer_anti_cheat_flags(id,match_id,user_id,flag_type,severity,evidence)
    values(\${crypto.randomUUID()},\${input.matchId},\${input.userId},\${input.severity === "high" ? "high" : input.severity},\${input.flagType},'{}'::jsonb)
  `;
}
