import {createFileRoute} from "@tanstack/react-router";
import {randomUUID} from "node:crypto";
import {getPrisma} from "@/lib/db";
import {requireUserId} from "@/lib/auth/verify.server";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
export const Route=createFileRoute("/api/payments/refund")({server:{handlers:{POST:async({request})=>{try{
 const userId=await requireUserId(); const body=await request.json() as {intentId?:string;reason?:string}; if(!body.intentId||!body.reason)return json({error:"intentId and reason are required"},400);
 const db=getPrisma(); const rows=await db.$queryRaw`select id,user_id,amount_atomic,status from blockchain_payment_intents where id=${body.intentId} and user_id=${userId} limit 1`; const intent=(rows as any[])[0];
 if(!intent)return json({error:"Payment not found"},404); if(intent.status!=="paid")return json({error:"Only paid payments can be refunded"},409);
 const existing=await db.$queryRaw`select id,status from blockchain_payment_refunds where intent_id=${body.intentId} and status not in ('rejected','failed') limit 1`; if((existing as any[]).length)return json({error:"Refund already requested"},409);
 const id=randomUUID(); await db.$queryRaw`insert into blockchain_payment_refunds(id,intent_id,user_id,amount_atomic,reason,status) values(${id},${body.intentId},${userId},${intent.amount_atomic},${String(body.reason).slice(0,500)},'requested')`;
 return json({ok:true,refundId:id,status:"requested"});
}catch(e){return json({error:e instanceof Error?e.message:"Refund request failed"},400)}}}}});