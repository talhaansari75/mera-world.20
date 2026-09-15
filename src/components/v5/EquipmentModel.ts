export type EquipmentModel={loading:boolean;error?:string;updatedAt:number};
export const emptyEquipment=():EquipmentModel=>({loading:false,updatedAt:Date.now()});
