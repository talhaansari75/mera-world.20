export type MatchTicket={id:string;userId:string;rating:number;mode:string;createdAt:number};
export const compatible=(a:MatchTicket,b:MatchTicket,window=250)=>a.mode===b.mode&&Math.abs(a.rating-b.rating)<=window;
export const rankWindow=(ageMs:number)=>Math.min(1200,250+Math.floor(ageMs/5000)*25);
