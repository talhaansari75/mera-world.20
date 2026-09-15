export type ExportBundle={version:1;userId:string;generatedAt:number;sections:Record<string,unknown>};
export const makeExport=(userId:string,sections:Record<string,unknown>):ExportBundle=>({version:1,userId,generatedAt:Date.now(),sections});
