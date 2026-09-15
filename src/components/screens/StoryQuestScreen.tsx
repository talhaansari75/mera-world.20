import React from "react";
import { useGame } from "@/lib/store";
import { Screen } from "./chrome";
import { STORY_QUESTS } from "@/lib/game/storyQuests";

export function StoryQuestScreen(){
 const save=useGame(s=>s.save);
 const stats=save.stats as any;
 const levels=stats.levelsCompleted??0, words=stats.wordsFound??0, bosses=stats.bossesDefeated??0;
 return <Screen title="Story Quests"><div className="grid gap-3">
 {STORY_QUESTS.map(q=>{const value=q.metric==="levels"?levels:q.metric==="words"?words:bosses; const pct=Math.min(100,value/q.target*100);
 return <div key={q.id} className="panel rounded-2xl p-4"><div className="flex justify-between"><b className="text-fg">{q.title}</b><span className="text-xs text-accent">+{q.reward}c</span></div>
 <p className="text-sm text-muted">{q.description}</p><div className="mt-2 h-2 rounded-full bg-black/20"><div className="h-full rounded-full bg-accent" style={{width:`${pct}%`}}/></div>
 <p className="mt-1 text-xs text-muted">{Math.min(value,q.target)} / {q.target}</p></div>})}</div></Screen>
}
