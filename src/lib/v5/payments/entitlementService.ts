export type Entitlement={userId:string;productId:string;active:boolean;source:"purchase"|"grant"|"refund";updatedAt:number};
export const activeEntitlements=(xs:Entitlement[],userId:string)=>xs.filter(x=>x.userId===userId&&x.active);
