import { createFileRoute } from "@tanstack/react-router";
import { getPrisma } from "@/lib/db";
import { isAdminUser } from "@/lib/v13/admin/access";
import { requireUserId } from "@/lib/auth/verify.server";

export const Route=createFileRoute("/api/payments/admin")({server:{handlers:{
 GET:async({request})=>{
  const userId=await requireUserId();
  if(!userId||!(await isAdminUser(userId))) return new Response(JSON.stringify({error:"Forbidden"}),{status:403,headers:{"content-type":"application/json"}});
  const db=getPrisma();
  const [summary,recent,health,refunds]=await Promise.all([
   db.$queryRawUnsafe(`select count(*)::int as intents, count(*) filter(where status='paid')::int as paid, count(*) filter(where status='pending')::int as pending, count(*) filter(where status='failed')::int as failed, coalesce(sum(amount_atomic) filter(where status='paid'),0)::text as paid_atomic from blockchain_payment_intents`),
   db.$queryRawUnsafe(`select id, user_id, product_id, chain_id, amount_atomic::text as amount_atomic, status, tx_hash, confirmations, created_at, paid_at from blockchain_payment_intents order by created_at desc limit 100`),
   db.$queryRawUnsafe(`select count(*) filter(where status='pending')::int as pending, count(*) filter(where status='paid')::int as paid, count(*) filter(where status='pending' and expires_at < now())::int as expired_pending, coalesce(avg(confirmations) filter(where status='paid'),0)::numeric(10,2) as avg_confirmations from blockchain_payment_intents`),
   db.$queryRawUnsafe(`select id,intent_id,user_id,amount_atomic::text as amount_atomic,reason,status,requested_at,processed_at,refund_tx_hash from blockchain_payment_refunds order by requested_at desc limit 50`)
  ]);
  return new Response(JSON.stringify({ok:true,summary:(summary as any[])[0]||{},payments:recent,health:(health as any[])[0]||{},refunds}),{headers:{"content-type":"application/json"}});
 }
}}});