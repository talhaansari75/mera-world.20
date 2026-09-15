export type Wallet={coins:number;diamonds:number;stars:number;energy:number};
export const emptyWallet=():Wallet=>({coins:0,diamonds:0,stars:0,energy:5});
export const canSpend=(w:Wallet,c:keyof Wallet,n:number)=>Number.isFinite(n)&&n>=0&&w[c]>=n;
export const spend=(w:Wallet,c:keyof Wallet,n:number):Wallet=>{if(!canSpend(w,c,n))throw new Error("INSUFFICIENT_FUNDS");return {...w,[c]:w[c]-n};};
