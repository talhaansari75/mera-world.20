export type ChaptersRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createChapters=(id:string):ChaptersRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchChapters=(x:ChaptersRecord):ChaptersRecord=>({...x,updatedAt:Date.now()});
