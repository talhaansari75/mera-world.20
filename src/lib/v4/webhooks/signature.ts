export function canonicalPayload(body:string){return body.replace(/\s+/g,' ').trim()}
export function constantTimeEqual(a:string,b:string){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
