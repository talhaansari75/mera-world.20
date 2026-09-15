export type AppealsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createAppeals=(id:string):AppealsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchAppeals=(x:AppealsRecord):AppealsRecord=>({...x,updatedAt:Date.now()});
