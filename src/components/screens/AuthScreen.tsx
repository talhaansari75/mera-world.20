import React,{useState} from "react";
import {Screen} from "./chrome";
import {localSignIn,localSignUp,getSession,signOut} from "@/lib/game/auth";

export function AuthScreen(){
 const [mode,setMode]=useState<"login"|"signup">("login"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[name,setName]=useState(""),[msg,setMsg]=useState("");
 const user=getSession();
 if(user)return <Screen title="Account"><div className="panel rounded-2xl p-5"><p className="font-bold text-fg">{user.name}</p><p className="text-sm text-muted">{user.email}</p><button className="hud-chip mt-4" onClick={()=>{signOut();location.reload()}}>Sign out</button></div></Screen>;
 const submit=()=>{const r=mode==="signup"?localSignUp(email,password,name):localSignIn(email,password);if(r.ok)location.reload();else setMsg(r.error||"Unable to continue.");};
 return <Screen title={mode==="login"?"Login":"Create Account"}><div className="panel rounded-2xl p-5 grid gap-3">
 {mode==="signup"&&<input className="rounded-xl p-3 bg-black/10" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>}
 <input className="rounded-xl p-3 bg-black/10" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
 <input className="rounded-xl p-3 bg-black/10" placeholder="Password (8+ chars)" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
 {msg&&<p className="text-sm text-red-400">{msg}</p>}
 <button className="hud-chip" onClick={submit}>{mode==="login"?"Login":"Sign Up"}</button>
 <button className="text-xs text-muted" onClick={()=>{setMode(mode==="login"?"signup":"login");setMsg("")}}>{mode==="login"?"Create a new account":"Already have an account? Login"}</button>
 </div></Screen>
}
