import { getPrisma } from "@/lib/db";
export async function audit(userId:string|null,eventType:string,payload:unknown,ipHash?:string){await getPrisma().auditEvent.create({data:{userId,eventType:eventType.slice(0,80),payloadJson:payload??{},ipHash:ipHash?.slice(0,128)}})}
