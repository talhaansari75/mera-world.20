export function puzzlePrompt(language:string,theme:string,count:number){return `Generate ${count} valid word-search terms in ${language} for theme ${theme}. Return JSON only.`}
export function npcPrompt(world:string,role:string){return `Create a safe, family-friendly NPC dialogue for ${role} in ${world}.` }
