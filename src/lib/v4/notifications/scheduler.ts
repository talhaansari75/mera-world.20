export type NotificationJob={userId:string,type:keyof typeof import('./templates').notificationTemplates,at:number};
export function schedule(userId:string,type:NotificationJob['type'],at:number):NotificationJob{return {userId,type,at}}
