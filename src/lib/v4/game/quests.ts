export type QuestStatus='locked'|'active'|'completed'|'claimed';
export type Quest={id:string,title:string,target:number,progress:number,status:QuestStatus};
export function updateQuest(q:Quest,amount=1):Quest{const progress=Math.min(q.target,q.progress+amount);return {...q,progress,status:progress>=q.target?'completed':q.status}}
