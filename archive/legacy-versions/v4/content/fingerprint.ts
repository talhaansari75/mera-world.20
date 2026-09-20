export function fingerprint(value:string){let h=2166136261;for(const c of value.normalize('NFC')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
