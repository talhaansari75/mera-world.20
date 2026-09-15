export type AnticheatRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createAnticheat=(id:string):AnticheatRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchAnticheat=(x:AnticheatRecord):AnticheatRecord=>({...x,updatedAt:Date.now()});
