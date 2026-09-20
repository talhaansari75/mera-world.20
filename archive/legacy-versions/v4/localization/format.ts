export function interpolate(text:string,vars:Record<string,string|number>){return text.replace(/\{(\w+)\}/g,(_,k)=>String(vars[k]??`{${k}}`))}
