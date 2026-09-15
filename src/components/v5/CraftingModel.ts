export type CraftingModel={loading:boolean;error?:string;updatedAt:number};
export const emptyCrafting=():CraftingModel=>({loading:false,updatedAt:Date.now()});
