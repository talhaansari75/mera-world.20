import React from "react";
import { useGame } from "@/lib/store";
import { Screen } from "./chrome";
import { STORY_CHAPTERS } from "@/lib/game/worldStory";

export function NPCScreen(){
 const open=useGame(s=>s.openDialogue);
 const affinity=useGame(s=>s.npcAffinity);
 return <Screen title="NPCs"><div className="grid gap-3">
 {STORY_CHAPTERS.map(c=><div key={c.id} className="panel rounded-2xl p-4">
   <div className="flex items-center justify-between"><div><p className="font-bold text-fg">{c.npc}</p><p className="text-xs text-muted">World {c.world} · Affinity {affinity[c.npc]??0}</p></div>
   <button className="hud-chip" onClick={()=>open(c.world)}>Talk</button></div>
 </div>)}
 </div></Screen>
}
