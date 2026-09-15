export type BondRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createBond=(id:string):BondRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchBond=(x:BondRecord):BondRecord=>({...x,updatedAt:Date.now()});
