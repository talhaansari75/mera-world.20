export type MultiplayerModel={loading:boolean;error?:string;updatedAt:number};
export const emptyMultiplayer=():MultiplayerModel=>({loading:false,updatedAt:Date.now()});
