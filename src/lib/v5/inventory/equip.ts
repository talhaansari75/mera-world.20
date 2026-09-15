export type EquipRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createEquip=(id:string):EquipRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchEquip=(x:EquipRecord):EquipRecord=>({...x,updatedAt:Date.now()});
