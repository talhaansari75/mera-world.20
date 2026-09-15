export type ShopModel={loading:boolean;error?:string;updatedAt:number};
export const emptyShop=():ShopModel=>({loading:false,updatedAt:Date.now()});
