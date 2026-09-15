export type Page<T>={items:T[];nextCursor:string|null;total?:number};
export function page<T>(items:T[],limit=50,cursor=0):Page<T>{const start=Math.max(0,cursor);const out=items.slice(start,start+limit);return {items:out,nextCursor:start+limit<items.length?String(start+limit):null,total:items.length}}
