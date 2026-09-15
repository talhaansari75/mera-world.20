export type ChainsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createChains=(id:string):ChainsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchChains=(x:ChainsRecord):ChainsRecord=>({...x,updatedAt:Date.now()});
