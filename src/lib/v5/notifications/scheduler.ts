export type NotificationJob={id:string;userId:string;kind:string;runAt:number;dedupeKey:string};
export const due=(job:NotificationJob,now=Date.now())=>job.runAt<=now;
export const dedupe=(jobs:NotificationJob[])=>[...new Map(jobs.map(j=>[j.dedupeKey,j])).values()];
