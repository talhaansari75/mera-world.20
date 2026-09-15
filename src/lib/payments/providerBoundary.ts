import { createHmac, timingSafeEqual } from "node:crypto";
export type VerifiedPurchase = { provider:string; externalId:string; productId:string; amountMinor:number; currency:string; raw:unknown; userId:string; expiresAt?:string|null; status?:"verified"|"refunded" };
export interface PaymentProvider { verifyWebhook(rawBody:string,signature:string|undefined):Promise<VerifiedPurchase|null>; }
export class HmacPaymentProvider implements PaymentProvider {
  constructor(private readonly secret:string, private readonly provider:string){ }
  async verifyWebhook(rawBody:string,signature:string|undefined){if(!signature||!this.secret)return null;const expected=createHmac("sha256",this.secret).update(rawBody).digest("hex");try{if(!timingSafeEqual(Buffer.from(expected),Buffer.from(signature)))return null;}catch{return null;}let x:any;try{x=JSON.parse(rawBody)}catch{return null;}if(String(x.provider??this.provider)!==this.provider||!x.userId||!x.externalId||!x.productId)return null;return{provider:this.provider,externalId:String(x.externalId).slice(0,128),productId:String(x.productId).slice(0,128),amountMinor:Math.max(0,Math.min(100000000,Math.floor(Number(x.amountMinor)||0))),currency:String(x.currency??"USD").toUpperCase().slice(0,8),raw:x,userId:String(x.userId).slice(0,128),expiresAt:x.expiresAt??null,status:x.status==="refunded"?"refunded":"verified"};}
}
