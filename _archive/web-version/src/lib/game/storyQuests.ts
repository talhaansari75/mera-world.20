export type Quest = {
  id:string; title:string; description:string; target:number;
  metric:"levels"|"words"|"bosses"; reward:number;
};
export const STORY_QUESTS:readonly Quest[]=[
 {id:"q-levels-5",title:"First Steps",description:"Complete 5 levels.",target:5,metric:"levels",reward:100},
 {id:"q-words-50",title:"Word Collector",description:"Find 50 words.",target:50,metric:"words",reward:150},
 {id:"q-boss-1",title:"Guardian Breaker",description:"Defeat 1 guardian.",target:1,metric:"bosses",reward:250},
 {id:"q-levels-25",title:"Journeyer",description:"Complete 25 levels.",target:25,metric:"levels",reward:500},
];
