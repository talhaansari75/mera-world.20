export type ArtifactManifest={version:number,files:number,generatedAt:string,features:string[]};
export const manifest=(files:number,features:string[]):ArtifactManifest=>({version:4,files,generatedAt:new Date().toISOString(),features});
