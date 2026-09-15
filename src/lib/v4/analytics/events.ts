export type AnalyticsEvent={name:string,userId?:string,sessionId:string,ts:number,properties:Record<string,unknown>};
export function event(name:string,sessionId:string,properties:Record<string,unknown>={}):AnalyticsEvent{return {name,sessionId,ts:Date.now(),properties}}
