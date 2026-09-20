export type AIProvider={id:string;generate(prompt:string):Promise<string>};
export async function withFallback(providers:AIProvider[],prompt:string){let last:unknown;for(const p of providers)try{return await p.generate(prompt)}catch(e){last=e}throw last??new Error('No AI provider available')}
