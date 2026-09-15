export type AnalyticsEvent={name:string;userId?:string;sessionId?:string;timestamp:number;properties:Record<string,string|number|boolean|null>};
export const event=(name:string,properties:AnalyticsEvent["properties"]={}):AnalyticsEvent=>({name,timestamp:Date.now(),properties});
