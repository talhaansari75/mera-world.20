import { useEffect, useState } from "react";
import { MessageCircle, RefreshCw, Swords, Users, Wifi } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { createMultiplayerRoom, getMultiplayerRoom, heartbeatMultiplayerRoom, joinMultiplayerRoom, quickMatchMultiplayer, sendMultiplayerRoomMessage } from "@/lib/server/multiplayer";

type Room = { roomId: string; hostUserId: string; mode: string; status: string; maxPlayers: number; members: Array<{ userId: string; displayName: string; role: string }>; state?: any };
type Props = { onBack?: () => void };

export function MultiplayerScreen({ onBack }: Props) {
  const user = useCurrentUser();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState(user?.displayName || "Traveler");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [log, setLog] = useState<Array<{ message: string; userId: string; createdAt: string }>>([]);
  const [notice, setNotice] = useState("");
  const [opponentKind, setOpponentKind] = useState<"human" | "bot" | null>(null);

  useEffect(() => { if (user?.displayName) setName(user.displayName); }, [user?.displayName]);

  useEffect(() => {
    if (!room) return;
    const poll = async () => {
      try {
        const result = await getMultiplayerRoom({ data: { roomId: room.roomId } });
        if (result.ok && result.room) {
          setRoom(result.room as Room);
          const msgs = Array.isArray((result.room as any).state?.messages) ? (result.room as any).state.messages : [];
          setLog(msgs);
        }
        await heartbeatMultiplayerRoom({ data: { roomId: room.roomId } });
      } catch {}
    };
    void poll();
    const timer = window.setInterval(poll, 3000);
    return () => window.clearInterval(timer);
  }, [room?.roomId]);

  async function quick() {
    setLoading(true); setNotice("");
    try {
      const r = await quickMatchMultiplayer();
      setOpponentKind(r.kind);
      if (r.kind === "human" && r.room) {
        setRoom(r.room as Room);
        setNotice("A real online player is available. Match connected.");
      } else {
        setRoom(null);
        setNotice("No online player is available right now. Practice opponent is ready.");
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not find an opponent.");
    } finally { setLoading(false); }
  }

  async function create() {
    setLoading(true); setNotice("");
    try {
      const r = await createMultiplayerRoom({ data: { displayName: name, mode: "classic", maxPlayers: 2 } });
      if (r.ok) { setRoom(r.room as Room); setOpponentKind(null); setNotice("Room created. Share the room code with another online player."); }
      else setNotice(r.error);
    } catch (e) { setNotice(e instanceof Error ? e.message : "Could not create room."); }
    finally { setLoading(false); }
  }

  async function join() {
    setLoading(true); setNotice("");
    try {
      const r = await joinMultiplayerRoom({ data: { roomId: roomCode.trim(), displayName: name } });
      if (r.ok) { setRoom(r.room as Room); setOpponentKind("human"); setNotice("Connected to the online room."); }
      else setNotice(r.error);
    } catch (e) { setNotice(e instanceof Error ? e.message : "Could not join room."); }
    finally { setLoading(false); }
  }

  async function send() {
    if (!room || !message.trim()) return;
    try {
      const r = await sendMultiplayerRoomMessage({ data: { roomId: room.roomId, message } });
      if (r.ok) setMessage("");
    } catch {}
  }

  return (
    <Screen title="Online Multiplayer" onBack={onBack}>
      <div className="mx-auto w-full max-w-3xl space-y-4 pb-10">
        <section className="panel rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/15"><Swords className="size-6 text-primary" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-fg">Challenge another traveler</h2>
              <p className="mt-1 text-sm text-muted">Online Multiplayer is for real online opponents. If nobody is online, you can enter a clearly identified practice match.</p>
            </div>
          </div>
          <button type="button" onClick={() => void quick()} disabled={loading} className="btn-primary mt-4 flex w-full items-center justify-center gap-2">
            <Wifi className="size-4" /> {loading ? "Finding opponent…" : "Quick Match"}
          </button>
          {notice && <p className="mt-3 rounded-2xl bg-surface-2 p-3 text-sm text-muted">{notice}</p>
          {opponentKind === "bot" && (
            <button type="button" onClick={() => useGame.getState().startLevel(1, "classic")} className="btn-primary mt-3">
              Start Practice Match
            </button>
          )}}
        </section>

        <section className="panel rounded-3xl p-5">
          <div className="flex items-center gap-2"><Users className="size-5 text-primary" /><h3 className="font-bold text-fg">Private room</h3></div>
          <p className="mt-1 text-xs text-muted">Create a room and give its code to another signed-in player.</p>
          <div className="mt-3 flex gap-2">
            <input value={name} onChange={e => setName(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg" placeholder="Your display name" />
            <button type="button" onClick={() => void create()} disabled={loading} className="hud-chip text-fg">Create</button>
          </div>
          <div className="mt-3 flex gap-2">
            <input value={roomCode} onChange={e => setRoomCode(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg" placeholder="Paste room ID" />
            <button type="button" onClick={() => void join()} disabled={loading} className="hud-chip text-fg">Join</button>
          </div>
        </section>

        {room && (
          <section className="panel rounded-3xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Room</p>
                <p className="break-all font-mono text-sm text-fg">{room.roomId}</p>
              </div>
              <span className="hud-chip text-fg">{opponentKind === "human" ? "ONLINE HUMAN" : room.members.length > 1 ? "ONLINE" : "WAITING"}</span>
            </div>
            <div className="mt-4 grid gap-2">
              {room.members.map(m => <div key={m.userId} className="flex items-center justify-between rounded-xl bg-surface-2 p-3"><span className="text-fg">{m.displayName}</span><span className="text-xs text-muted">{m.role}</span></div>)}
            </div>

            {opponentKind === "human" && (
              <div className="mt-4 rounded-2xl bg-surface-2 p-4">
                <div className="mb-2 flex items-center gap-2"><MessageCircle className="size-4 text-primary" /><span className="font-semibold text-fg">Match chat</span></div>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {log.length ? log.map(x => <p key={x.createdAt + x.userId + x.message} className="text-sm text-fg"><span className="text-muted">@{x.userId === user?.id ? "you" : "opponent"}:</span> {x.message}</p>) : <p className="text-xs text-muted">No comments yet.</p>}
                </div>
                <div className="mt-3 flex gap-2">
                  <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void send(); }} maxLength={160} className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-fg" placeholder="Write a comment…" />
                  <button type="button" onClick={() => void send()} className="hud-chip text-fg">Send</button>
                </div>
              </div>
            )}

            {opponentKind === "human" && room.members.length > 1 && (
              <button type="button" onClick={() => {
                sessionStorage.setItem("mwsj.multiplayer.room", room.roomId);
                useGame.getState().startLevel(1, "classic");
              }} className="btn-primary mt-4 flex items-center justify-center gap-2">
                <Swords className="size-4" /> Start Match
              </button>
            )}
            <button type="button" onClick={() => { setRoom(null); setOpponentKind(null); }} className="hud-chip mt-4 flex items-center gap-2 text-fg"><RefreshCw className="size-4" /> Leave</button>
          </section>
        )}
      </div>
    </Screen>
  );
}

export default MultiplayerScreen;
