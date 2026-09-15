import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { withIdempotency } from "./idempotency";
import { recordGameplayEvents } from "@/lib/analytics/serverTelemetry";
import { createRoom, getRoom, joinRoom } from "@/lib/multiplayer/roomService";
import { audit } from "./audit";
import { getPrisma } from "@/lib/db";

const text=(v:unknown,max:number)=>String(v??"").slice(0,max);
const finiteInt=(v:unknown,min:number,max:number)=>Math.max(min,Math.min(max,Math.floor(Number(v)||0)));

export const ingestTelemetry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: {sessionId?:unknown;events?:unknown}) => ({sessionId:text(d.sessionId,128),events:Array.isArray(d.events)?d.events:[]})).handler(async ({ context, data }) => recordGameplayEvents(context.userId, data.sessionId, data.events as Array<{type:string;payload?:unknown;clientTs?:number}>));

export const createMultiplayerRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: {idempotencyKey?:unknown;displayName?:unknown;mode?:unknown;maxPlayers?:unknown}) => ({idempotencyKey:text(d.idempotencyKey,128),displayName:text(d.displayName??"Traveler",40),mode:text(d.mode??"classic",40),maxPlayers:finiteInt(d.maxPlayers,2,8)})).handler(async ({ context, data }) => {
  return withIdempotency(context.userId, data.idempotencyKey, "room.create", async () => ({ roomId: await createRoom(context.userId, data.displayName, data.mode, data.maxPlayers) }));
});

export const joinMultiplayerRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: {displayName?:unknown;roomId?:unknown}) => ({displayName:text(d.displayName??"Traveler",40),roomId:text(d.roomId,64)})).handler(async ({ context, data }) => joinRoom(context.userId, data.displayName, data.roomId));
export const readMultiplayerRoom = createServerFn({ method: "GET" }).validator((id: string) => String(id).slice(0,64)).handler(async ({ data }) => getRoom(data));

export const submitModerationReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d: {targetType?:unknown;targetId?:unknown;reason?:unknown;details?:unknown}) => ({targetType:text(d.targetType,32),targetId:text(d.targetId,128),reason:text(d.reason,64),details:text(d.details,1000)})).handler(async ({ context, data }) => {
  await getPrisma().moderationReport.create({data:{reporterUserId:context.userId,targetType:data.targetType,targetId:data.targetId,reason:data.reason,details:data.details}});
  await audit(context.userId, "moderation.reported", { targetType: data.targetType, targetId: data.targetId });
  return { ok: true as const };
});
