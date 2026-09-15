export type MissionPeriod="daily"|"weekly"|"monthly";
export type Mission={id:string;period:MissionPeriod;title:string;description:string;metric:"levels"|"words"|"coins";target:number;reward:number};
export const MISSIONS:readonly Mission[]=[
{id:"d1",period:"daily",title:"Daily Explorer",description:"Complete 3 levels.",metric:"levels",target:3,reward:75},
{id:"d2",period:"daily",title:"Daily Wordsmith",description:"Find 20 words.",metric:"words",target:20,reward:100},
{id:"w1",period:"weekly",title:"Weekly Journey",description:"Complete 15 levels.",metric:"levels",target:15,reward:400},
{id:"w2",period:"weekly",title:"Weekly Fortune",description:"Earn 1000 coins.",metric:"coins",target:1000,reward:500},
{id:"m1",period:"monthly",title:"Monthly Champion",description:"Complete 75 levels.",metric:"levels",target:75,reward:1500}];
export function periodKey(p:MissionPeriod,now=new Date()){if(p==="daily")return now.toISOString().slice(0,10);if(p==="monthly")return now.toISOString().slice(0,7);const d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));const day=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-day);return d.toISOString().slice(0,10);}
