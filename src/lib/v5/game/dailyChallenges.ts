export type DailyChallenge={date:string;seed:string;levelId:number;modifiers:string[]};
export const dailySeed=(date:string)=>`daily:${date}`;
export const buildDaily=(date:string,levelId:number,modifiers:string[]=[]):DailyChallenge=>({date,seed:dailySeed(date),levelId,modifiers:[...new Set(modifiers)]});
