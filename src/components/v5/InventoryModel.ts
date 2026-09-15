export type InventoryModel={loading:boolean;error?:string;updatedAt:number};
export const emptyInventory=():InventoryModel=>({loading:false,updatedAt:Date.now()});
