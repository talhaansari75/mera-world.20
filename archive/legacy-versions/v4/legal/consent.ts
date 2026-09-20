export type Consent={userId:string,version:string,acceptedAt:number};
export function accepted(consents:Consent[],version:string){return consents.some(c=>c.version===version)}
