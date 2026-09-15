export type ExportBundle={version:1,userId:string,createdAt:string,data:Record<string,unknown>};
export function createExport(userId:string,data:Record<string,unknown>):ExportBundle{return {version:1,userId,createdAt:new Date().toISOString(),data}}
