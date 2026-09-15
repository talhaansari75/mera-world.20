export type LoggingRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createLogging=(id:string):LoggingRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchLogging=(x:LoggingRecord):LoggingRecord=>({...x,updatedAt:Date.now()});
