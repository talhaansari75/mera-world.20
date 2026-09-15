export type Check={name:string;ok:boolean;detail?:string};
export const overall=(checks:Check[])=>checks.length>0&&checks.every(c=>c.ok);
