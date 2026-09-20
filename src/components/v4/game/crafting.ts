export type Recipe={id:string,inputs:Record<string,number>,output:{itemId:string,quantity:number}};
export function canCraft(stock:Record<string,number>,recipe:Recipe){return Object.entries(recipe.inputs).every(([id,n])=>(stock[id]??0)>=n)}
