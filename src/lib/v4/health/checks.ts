export type Health={name:string,ok:boolean,latencyMs?:number,detail?:string};
export function overall(checks:Health[]){return checks.every(c=>c.ok)}
