import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getPrisma } from "@/lib/db";
export const getMyEntitlements=createServerFn({method:"GET"}).middleware([authMiddleware]).handler(async({context})=>getPrisma().entitlement.findMany({where:{userId:context.userId,OR:[{expiresAt:null},{expiresAt:{gt:new Date()}}]},orderBy:{updatedAt:"desc"},select:{productId:true,active:true,source:true,updatedAt:true,expiresAt:true}}).then(rows=>rows.map(r=>({...r,updatedAt:r.updatedAt.toISOString(),expiresAt:r.expiresAt?.toISOString() ?? null}))));
export const recordVerifiedPurchase=createServerFn({method:"POST"}).middleware([authMiddleware]).validator((d:{provider:string;externalId:string})=>({provider:String(d.provider??"").slice(0,32),externalId:String(d.externalId??"").slice(0,128)})).handler(async()=>({ok:false as const,error:"Manual purchase grants are disabled. Use the signed payment webhook."}));
