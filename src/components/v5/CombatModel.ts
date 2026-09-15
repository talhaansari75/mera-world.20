export type CombatModel={loading:boolean;error?:string;updatedAt:number};
export const emptyCombat=():CombatModel=>({loading:false,updatedAt:Date.now()});
