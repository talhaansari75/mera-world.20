export type Entitlement={userId:string,sku:string,active:boolean,expiresAt:number|null};
export function active(e:Entitlement,now=Date.now()){return e.active&&(e.expiresAt===null||e.expiresAt>now)}
