export type Versioned<T>={value:T;version:number;updatedAt:number};
export function mergeLww<T>(local:Versioned<T>,remote:Versioned<T>):Versioned<T>{return remote.updatedAt>local.updatedAt?remote:local;}
