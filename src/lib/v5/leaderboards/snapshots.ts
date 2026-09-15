export type SnapshotsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createSnapshots=(id:string):SnapshotsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchSnapshots=(x:SnapshotsRecord):SnapshotsRecord=>({...x,updatedAt:Date.now()});
