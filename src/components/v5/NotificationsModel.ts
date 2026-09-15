export type NotificationsModel={loading:boolean;error?:string;updatedAt:number};
export const emptyNotifications=():NotificationsModel=>({loading:false,updatedAt:Date.now()});
