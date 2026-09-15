import React from "react";
import { useGame } from "@/lib/store";
import { Screen } from "./chrome";

export function DialogueScreen(){
 const dialogue=useGame(s=>s.dialogue);
 const choose=useGame(s=>s.chooseDialogue);
 const close=useGame(s=>s.closeDialogue);
 if(!dialogue) return <Screen title="NPCs"><div className="panel rounded-2xl p-5 text-muted">No conversation active.</div></Screen>;
 return <Screen title="Conversation"><div className="panel rounded-2xl p-5">
   <p className="text-xs text-accent">{dialogue.speaker}</p>
   <p className="mt-3 text-lg font-semibold text-fg">{dialogue.text}</p>
   <div className="mt-5 grid gap-2">{dialogue.choices.map(c=>
     <button key={c.id} className="hud-chip text-left" onClick={()=>choose(c.id)}>{c.text}{c.reward?`  (+${c.reward}c)`:``}</button>
   )}</div>
   <button className="mt-4 text-xs text-muted" onClick={close}>Close</button>
 </div></Screen>
}
