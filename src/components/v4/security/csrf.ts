export function sameOrigin(origin:string,expected:string){try{return new URL(origin).origin===new URL(expected).origin}catch{return false}}
export function csrfToken(seed:string){let h=2166136261;for(const c of seed){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
