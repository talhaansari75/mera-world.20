export type SettingsModel={loading:boolean;error?:string;updatedAt:number};
export const emptySettings=():SettingsModel=>({loading:false,updatedAt:Date.now()});
