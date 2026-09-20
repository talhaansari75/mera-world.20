export type DashboardModel={loading:boolean;error?:string;updatedAt:number};
export const emptyDashboard=():DashboardModel=>({loading:false,updatedAt:Date.now()});
