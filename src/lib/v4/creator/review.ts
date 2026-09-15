export type ReviewStatus='pending'|'approved'|'rejected';
export type Review={packId:string,reviewerId:string,status:ReviewStatus,notes?:string};
