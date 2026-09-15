export type AiRequest={task:"hint"|"translation"|"content"|"dialogue";input:string;locale:string};
export type AiResult={text:string;provider:string;cached:boolean};
export interface AiProvider{generate(request:AiRequest):Promise<AiResult>;}
