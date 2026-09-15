export type VersionsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createVersions=(id:string):VersionsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchVersions=(x:VersionsRecord):VersionsRecord=>({...x,updatedAt:Date.now()});
