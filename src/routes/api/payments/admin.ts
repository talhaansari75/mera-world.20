import { createFileRoute } from "@tanstack/react-router";
import { getPrisma } from "@/lib/db";
import { isAdminUser } from "@/lib/v13/admin/access";

export const Route=createFileRoute("/api/payments/admin")({server:{handlers:{
 GET:async({request})=>{
  const userId=request.headers.get("x-user-id");
  if(!userId||!(await isAdminUser(userId))) return new Response(JSON.stringify({error:"Forbidden"}),{status:403,headers:{"content-type":"application/json"}});
  const db=getPrisma();
  const [summary,recent]=await Promise.all([
   db.$queryRawUnsafe(`select count(*)::int as intents, count(*) filter(where status='paid')::int as paid, count(*) filter(where status='pending')::int as pending, count(*) filter(where status='failed')::int as failed, coalesce(sum(amount_atomic) filter(where status='paid'),0)::text as paid_atomic from blockchain_payment_intents`),
   db.$queryRawUnsafe(`select id, user_id, product_id, chain_id, amount_atomic::text as amount_atomic, status, tx_hash, confirmations, created_at, paid_at from blockchain_payment_intents order by created_at desc limit 100`)
  ]);
  return new Response(JSON.stringify({ok:true,summary:(summary as any[])[0]||{},payments:recent}),{headers:{"content-type":"application/json"}});
 }
}}});