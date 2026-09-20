export type RuntimeConfig={appEnv:string;apiBaseUrl:string;maxPlayers:number;offlineEnabled:boolean};
export function runtimeConfig(env:Record<string,string|undefined>):RuntimeConfig{return {appEnv:env.APP_ENV??'development',apiBaseUrl:env.API_BASE_URL??'/api',maxPlayers:Number(env.MAX_PLAYERS??8),offlineEnabled:env.OFFLINE_ENABLED!=='false'}}
