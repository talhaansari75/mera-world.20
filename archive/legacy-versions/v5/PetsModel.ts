export type PetsModel={loading:boolean;error?:string;updatedAt:number};
export const emptyPets=():PetsModel=>({loading:false,updatedAt:Date.now()});
