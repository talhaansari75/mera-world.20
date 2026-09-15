import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
export const getCloudRevision=createServerFn({method:"GET"}).middleware([authMiddleware]).handler(async({context})=>{const row=await getPrisma().playerSave.findUnique({where:{userId:context.userId}});return row?{ok:true as const,revision:Number(row.revision),updatedAt:row.updatedAt.toISOString()}:{ok:true as const,revision:0,updatedAt:null}});
