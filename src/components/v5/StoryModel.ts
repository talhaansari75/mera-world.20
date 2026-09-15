export type StoryModel={loading:boolean;error?:string;updatedAt:number};
export const emptyStory=():StoryModel=>({loading:false,updatedAt:Date.now()});
