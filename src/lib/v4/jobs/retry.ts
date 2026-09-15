export function backoff(attempt:number,base=250,max=30000){return Math.min(max,base*2**attempt)}
export async function retry<T>(fn:()=>Promise<T>,attempts=3){let e:unknown;for(let i=0;i<attempts;i++)try{return await fn()}catch(x){e=x;await new Promise(r=>setTimeout(r,backoff(i)))}throw e}
