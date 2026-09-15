import { useEffect, useState } from "react";
import { Screen } from "@/components/screens/chrome";
import { listCreatorCommunity, reviewCreatorPuzzle } from "@/lib/v26/creator/community";
import { useGame } from "@/lib/store";

type Row={id:string;title:string;category:string;rating:number;review_count:number};
export function CreatorCommunityScreen(){
 const [rows,setRows]=useState<Row[]>([]); const [msg,setMsg]=useState("");
 const load=()=>void listCreatorCommunity().then(setRows).catch(()=>setRows([]));
 useEffect(load,[]);
 const review=async(id:string)=>{const raw=window.prompt("Rating 1–5 and optional comment, separated by |", "5|");if(raw===null)return;const [r,b=""]=raw.split("|",2);const rating=Number(r);if(!Number.isFinite(rating)||rating<1||rating>5){setMsg("Rating must be 1–5.");return;}try{const x=await reviewCreatorPuzzle({data:{puzzleId:id,rating,body:b}});setMsg(x.ok?"Review saved.":x.error);load();}catch{setMsg("Sign in to review community puzzles.");}};
 return <Screen title="Creator Community"><div className="grid gap-3"><p className="text-sm text-muted">Approved creator journeys are moderated before appearing here. Ratings are account-scoped and one review per puzzle.</p>{msg&&<p className="text-sm text-muted">{msg}</p>}{rows.map(r=><article key={r.id} className="panel rounded-2xl p-4"><div className="flex items-center justify-between"><b className="text-fg">{r.title}</b><span className="text-xs text-muted">{r.rating.toFixed(1)} ★ · {r.review_count} reviews</span></div><p className="text-xs text-muted">{r.category} · v{r.version}</p><button className="hud-chip mt-2 text-fg" onClick={()=>review(r.id)}>Rate</button></article>)}{!rows.length&&<p className="text-muted">No approved creator journeys yet.</p>}<button className="text-sm text-muted" onClick={()=>useGame.getState().go("more")}>Back to More</button></div></Screen>;
}
