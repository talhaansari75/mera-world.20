export type JobStatus="queued"|"running"|"done"|"failed";
export type Job<T=unknown>={id:string;type:string;payload:T;status:JobStatus;attempts:number};
export const retryable=(j:Job,max=5)=>j.status==="failed"&&j.attempts<max;
