export type Conflict<T>={local:T,remote:T,reason:string};
export function lastWriteWins<T extends {updatedAt:number}>(a:T,b:T){return a.updatedAt>=b.updatedAt?a:b}
