export async function sha256Hex(input:string):Promise<string>{const data=new TextEncoder().encode(input);const digest=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");}
export const constantTimeEqual=(a:string,b:string)=>a.length===b.length && [...a].every((c,i)=>c===b[i]);
