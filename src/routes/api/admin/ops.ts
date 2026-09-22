import { createFileRoute } from "@tanstack/react-router";
import { getPrisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { isAdminUser } from "@/lib/v13/admin/access";

const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});

export const Route=createFileRoute("/api/admin/ops")({server:{handlers:{
 GET:async({request})=>{try{
  const userId=await requireUserId();
  if(!(await isAdminUser(userId)))return json({error:"Forbidden"},403);
  const db=getPrisma();
  const [payments,refunds,chatReports,antiCheat,voice,actions]=await Promise.all([
   db.$queryRaw`select count(*)::int as total,count(*) filter(where status='pending')::int as pending,count(*) filter(where status='paid')::int as paid,count(*) filter(where status='failed')::int as failed,count(*) filter(where status='pending' and expires_at<now())::int as expired from blockchain_payment_intents`,
   db.$queryRaw`select count(*)::int as total,count(*) filter(where status='requested')::int as requested,count(*) filter(where status='processing')::int as processing from blockchain_payment_refunds`,
   db.$queryRaw`select count(*)::int as total,count(*) filter(where status='open')::int as open,count(*) filter(where status='reviewing')::int as reviewing from multiplayer_chat_reports`,
   db.$queryRaw`select count(*)::int as total,count(*) filter(where severity='high' and resolved_at is null)::int as high_open,count(*) filter(where severity='medium' and resolved_at is null)::int as medium_open from multiplayer_anti_cheat_flags`,
   db.$queryRaw`select count(*)::int as total,count(*) filter(where expires_at<now())::int as expired from multiplayer_voice_messages`,
   db.$queryRaw`select count(*)::int as total,count(*) filter(where created_at>=now()-interval '24 hours')::int as last_24h from multiplayer_action_receipts`
  ]);
  return json({ok:true,payments:payments[0]??{},refunds:refunds[0]??{},chatReports:chatReports[0]??{},antiCheat:antiCheat[0]??{},voice:voice[0]??{},actionReceipts:actions[0]??{},generatedAt:new Date().toISOString()});
 }catch(e){return json({error:e instanceof Error?e.message:"admin_ops_failed"},500)}}
}}});