export type MigrationRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createMigration=(id:string):MigrationRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchMigration=(x:MigrationRecord):MigrationRecord=>({...x,updatedAt:Date.now()});
