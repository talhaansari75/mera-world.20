export const requiredServerEnv=["DATABASE_URL"] as const;
export function missing(env:Record<string,string|undefined>){return requiredServerEnv.filter(k=>!env[k]);}
