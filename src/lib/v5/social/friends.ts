export type FriendsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createFriends=(id:string):FriendsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchFriends=(x:FriendsRecord):FriendsRecord=>({...x,updatedAt:Date.now()});
