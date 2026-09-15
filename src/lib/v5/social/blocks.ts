export type BlocksRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createBlocks=(id:string):BlocksRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchBlocks=(x:BlocksRecord):BlocksRecord=>({...x,updatedAt:Date.now()});
