export function dailySeed(date:string,world=1){let h=2166136261;for(const c of `${date}:${world}`){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
