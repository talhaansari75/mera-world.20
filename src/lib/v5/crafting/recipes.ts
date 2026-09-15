export type RecipesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRecipes=(id:string):RecipesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRecipes=(x:RecipesRecord):RecipesRecord=>({...x,updatedAt:Date.now()});
