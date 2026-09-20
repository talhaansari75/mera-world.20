export type LeaderboardModel={loading:boolean;error?:string;updatedAt:number};
export const emptyLeaderboard=():LeaderboardModel=>({loading:false,updatedAt:Date.now()});
