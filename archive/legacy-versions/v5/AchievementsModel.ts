export type AchievementsModel={loading:boolean;error?:string;updatedAt:number};
export const emptyAchievements=():AchievementsModel=>({loading:false,updatedAt:Date.now()});
