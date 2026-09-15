export type RequestContext={requestId:string;userId?:string;role?:string;ipHash?:string;locale?:string};
export const requireUser=(ctx:RequestContext):string=>{if(!ctx.userId) throw new Error("AUTH_REQUIRED"); return ctx.userId};
export const requireRole=(ctx:RequestContext,roles:string[])=>{if(!ctx.role||!roles.includes(ctx.role)) throw new Error("FORBIDDEN");};
