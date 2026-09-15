import { useEffect, useState } from "react";
import { Users, RefreshCw, Copy, LogIn, Plus } from "lucide-react";
import { useGame } from "@/lib/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { createMultiplayerRoom, getMultiplayerRoom, joinMultiplayerRoom } from "@/lib/server/multiplayer";

type Room = { room_id: string; mode: string; status: string; max_players: number; members: { user_id: string; display_name: string; role: string }[] };

export function MultiplayerScreen({ onBack }: { onBack: () => void }) {
  const save = useGame((s) => s.save); const user = useCurrentUser();
  const [name, setName] = useState(save.playerName || "Traveler"); const [roomId, setRoomId] = useState("");
  const [room, setRoom] = useState<Room | null>(null); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("Sign in to create or join an online room.");
  const refresh = async (id = room?.room_id || roomId) => { if (!id) return; setBusy(true); try { const r = await getMultiplayerRoom({ data: { roomId: id } }); if (r.ok) { setRoom(r.room as Room); setRoomId(id); setMsg("Room is live. Share the room ID with your friends."); } else setMsg(r.error); } catch { setMsg("Unable to reach the multiplayer service."); } finally { setBusy(false); } };
  useEffect(() => { if (!room?.room_id) return; const t = window.setInterval(() => void refresh(room.room_id), 4000); return () => clearInterval(t); }, [room?.room_id]);
  const create = async () => { setBusy(true); try { const r = await createMultiplayerRoom({ data: { displayName: name, mode: "classic", maxPlayers: 4 } }); if (r.ok) { const next = r.room as Room; setRoom(next); setRoomId(next.room_id); setMsg("Room created successfully."); } else setMsg(r.error); } catch { setMsg("Sign in to use online multiplayer."); } finally { setBusy(false); } };
  const join = async () => { setBusy(true); try { const r = await joinMultiplayerRoom({ data: { roomId: roomId.trim(), displayName: name } }); if (r.ok) { setRoom(r.room as Room); setMsg("Joined room successfully."); } else setMsg(r.error); } catch { setMsg("Sign in to use online multiplayer."); } finally { setBusy(false); } };
  const copy = async () => { if (roomId) { await navigator.clipboard?.writeText(roomId); setMsg("Room ID copied."); } };
  return <div className="min-h-screen p-5"><div className="mx-auto max-w-xl space-y-4">
    <div className="flex items-center gap-3"><Users /><div><h1 className="text-2xl font-bold">Online Multiplayer</h1><p className="text-sm opacity-70">Real room service + live member roster</p></div></div>
    <label className="block text-sm">Display name<input className="mt-1 w-full rounded-xl border bg-transparent p-3" value={name} onChange={e=>setName(e.target.value)} maxLength={40}/></label>
    <div className="flex gap-2"><button disabled={busy || !user} onClick={()=>void create()} className="rounded-xl border px-4 py-2"><Plus className="mr-1 inline" size={16}/>Create room</button><button disabled={busy || !user} onClick={()=>void join()} className="rounded-xl border px-4 py-2"><LogIn className="mr-1 inline" size={16}/>Join room</button></div>
    <div className="flex gap-2"><input className="min-w-0 flex-1 rounded-xl border bg-transparent p-3" placeholder="Paste room ID" value={roomId} onChange={e=>setRoomId(e.target.value)}/><button onClick={()=>void copy()} className="rounded-xl border px-3" aria-label="Copy room ID"><Copy size={17}/></button></div>
    {room && <div className="rounded-2xl border p-4 space-y-3"><div className="flex items-center justify-between"><b>Room {room.room_id.slice(0,8)}…</b><button onClick={()=>void refresh()} disabled={busy} className="rounded-lg border p-2"><RefreshCw size={16}/></button></div><div className="text-sm opacity-70">Mode: {room.mode} · {room.members.length}/{room.max_players} players · {room.status}</div>{room.members.map(m=><div key={m.user_id} className="rounded-lg bg-black/5 p-2 text-sm">{m.display_name} {m.role === "host" ? "• Host" : ""}</div>)}</div>}
    <p className="text-sm opacity-70">{msg}</p><button onClick={onBack} className="rounded-xl border px-4 py-2">Back</button>
  </div></div>;
}
