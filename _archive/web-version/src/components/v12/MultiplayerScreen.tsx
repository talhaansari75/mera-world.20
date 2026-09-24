import { useEffect, useRef, useState } from "react";
import { MessageCircle, RefreshCw, Swords, Users, Wifi, Bot } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import {
  createMultiplayerRoom,
  getMultiplayerRoom,
  heartbeatMultiplayerRoom,
  joinMultiplayerRoom,
  quickMatchMultiplayer,
  sendMultiplayerRoomMessage,
} from "@/lib/server/multiplayer";

type Room = {
  roomId: string;
  hostUserId: string;
  mode: string;
  status: string;
  maxPlayers: number;
  members: Array<{ userId: string; displayName: string; role: string }>;
  state?: any;
};

type Props = { onBack?: () => void };

const BOT_WAIT_MS = 10_000;

export function MultiplayerScreen({ onBack }: Props) {
  const user = useCurrentUser();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState(user?.displayName || "Traveler");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [log, setLog] = useState<Array<{ message: string; userId: string; createdAt: string }>>([]);
  const [notice, setNotice] = useState("");
  const [opponentKind, setOpponentKind] = useState<"human" | "waiting" | "bot" | null>(null);
  const startedRoomRef = useRef<string | null>(null);
  const botTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user?.displayName]);

  const clearBotTimer = () => {
    if (botTimerRef.current != null) {
      window.clearTimeout(botTimerRef.current);
      botTimerRef.current = null;
    }
  };

  const startMatch = (kind: "human" | "bot", roomId?: string) => {
    const key = kind === "bot" ? "practice-bot" : roomId || "";
    if (startedRoomRef.current === key) return;
    startedRoomRef.current = key;

    if (kind === "human" && roomId) {
      sessionStorage.setItem("mwsj.multiplayer.room", roomId);
      sessionStorage.removeItem("mwsj.multiplayer.bot");
    } else {
      sessionStorage.removeItem("mwsj.multiplayer.room");
      sessionStorage.setItem("mwsj.multiplayer.bot", "1");
    }

    useGame.getState().startLevel(1, "classic");
  };

  const launchBotFallback = () => {
    clearBotTimer();
    setOpponentKind("bot");
    setNotice("No second player joined. Practice Bot is entering the same race.");
    startMatch("bot");
  };

  useEffect(() => {
    if (!room) return;

    const poll = async () => {
      try {
        const result = await getMultiplayerRoom({ data: { roomId: room.roomId } });
        if (result.ok && result.room) {
          const next = result.room as Room;
          setRoom(next);

          const msgs = Array.isArray(next.state?.messages) ? next.state.messages : [];
          setLog(msgs);

          if (next.members.length >= 2) {
            clearBotTimer();
            setOpponentKind("human");
            setNotice("Opponent found. Starting the live race…");
            startMatch("human", next.roomId);
            return;
          }

          if (opponentKind !== "bot") {
            setOpponentKind("waiting");
            setNotice("Waiting for another player…");
          }
        }

        await heartbeatMultiplayerRoom({ data: { roomId: room.roomId } });
      } catch {
        // Keep the lobby usable if a single polling request fails.
      }
    };

    void poll();
    const timer = window.setInterval(poll, 2000);
    return () => window.clearInterval(timer);
  }, [room?.roomId]);

  useEffect(() => () => clearBotTimer(), []);

  async function quick() {
    clearBotTimer();
    startedRoomRef.current = null;
    setLoading(true);
    setNotice("");

    try {
      const r = await quickMatchMultiplayer();

      if (r.kind === "human" && r.room) {
        setOpponentKind("human");
        setRoom(r.room as Room);
        setNotice("Opponent found. Starting the live race…");
        startMatch("human", (r.room as Room).roomId);
        return;
      }

      if (r.room) {
        const waitingRoom = r.room as Room;
        setRoom(waitingRoom);
        setOpponentKind("waiting");
        setNotice("Room created. Searching for a player for 10 seconds…");

        botTimerRef.current = window.setTimeout(() => {
          launchBotFallback();
        }, BOT_WAIT_MS);
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not find an opponent.");
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    clearBotTimer();
    startedRoomRef.current = null;
    setLoading(true);
    setNotice("");

    try {
      const r = await createMultiplayerRoom({
        data: { displayName: name, mode: "classic", maxPlayers: 2 },
      });
      if (r.ok) {
        setRoom(r.room as Room);
        setOpponentKind("waiting");
        setNotice("Room created. Share the room code with another signed-in player.");
      } else {
        setNotice(r.error);
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not create room.");
    } finally {
      setLoading(false);
    }
  }

  async function join() {
    clearBotTimer();
    startedRoomRef.current = null;
    setLoading(true);
    setNotice("");

    try {
      const r = await joinMultiplayerRoom({
        data: { roomId: roomCode.trim(), displayName: name },
      });
      if (r.ok) {
        const next = r.room as Room;
        setRoom(next);
        setOpponentKind("human");
        setNotice("Opponent found. Starting the live race…");
        startMatch("human", next.roomId);
      } else {
        setNotice(r.error);
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not join room.");
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    if (!room || !message.trim()) return;
    try {
      const r = await sendMultiplayerRoomMessage({
        data: { roomId: room.roomId, message },
      });
      if (r.ok) setMessage("");
    } catch {}
  }

  const leave = () => {
    clearBotTimer();
    startedRoomRef.current = null;
    sessionStorage.removeItem("mwsj.multiplayer.room");
    sessionStorage.removeItem("mwsj.multiplayer.bot");
    setRoom(null);
    setOpponentKind(null);
    setNotice("");
  };

  return (
    <Screen title="Online Multiplayer" onBack={onBack}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-8">
        <section className="panel rounded-3xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/15">
              <Swords className="size-6 text-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-fg sm:text-xl">Live Word Search Match</h2>
              <p className="mt-1 text-sm leading-5 text-muted">
                Both players get the same puzzle and race to find the words first. If no human joins,
                a clearly identified Practice Bot takes the second slot.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void quick()}
            disabled={loading}
            className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
          >
            <Wifi className="size-4" />
            {loading ? "Finding opponent…" : "Quick Match"}
          </button>

          {notice && (
            <div className="mt-3 rounded-2xl bg-surface-2 p-3 text-sm text-muted">
              {notice}
            </div>
          )}

          {opponentKind === "waiting" && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface">
                <Users className="size-5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-fg">Finding Player 2</p>
                <p className="text-xs text-muted">The match will start automatically when a human joins.</p>
              </div>
            </div>
          )}

          {opponentKind === "bot" && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface">
                <Bot className="size-5 text-gold" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-fg">Practice Bot ready</p>
                <p className="text-xs text-muted">The bot races on the same board and its score updates during the round.</p>
              </div>
            </div>
          )}
        </section>

        <section className="panel rounded-3xl p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <h3 className="font-bold text-fg">Private room</h3>
          </div>
          <p className="mt-1 text-xs text-muted">
            Create a room and give its code to another signed-in player.
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-0 rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
              placeholder="Your display name"
            />
            <button type="button" onClick={() => void create()} disabled={loading} className="hud-chip min-h-11 justify-center text-fg">
              Create
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="min-w-0 rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
              placeholder="Paste room ID"
            />
            <button type="button" onClick={() => void join()} disabled={loading} className="hud-chip min-h-11 justify-center text-fg">
              Join
            </button>
          </div>
        </section>

        {room && (
          <section className="panel rounded-3xl p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted">Room</p>
                <p className="break-all font-mono text-xs text-fg sm:text-sm">{room.roomId}</p>
              </div>
              <span className="hud-chip text-fg">
                {opponentKind === "human"
                  ? "PLAYER 2 CONNECTED"
                  : opponentKind === "waiting"
                    ? "WAITING"
                    : opponentKind === "bot"
                      ? "PRACTICE BOT"
                      : room.members.length > 1
                        ? "ONLINE"
                        : "WAITING"}
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted">Player 1</p>
                <p className="mt-1 truncate font-semibold text-fg">{room.members[0]?.displayName || name}</p>
                <p className="text-xs text-muted">Ready</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface-2 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted">Player 2</p>
                <p className="mt-1 truncate font-semibold text-fg">
                  {room.members[1]?.displayName || (opponentKind === "bot" ? "Practice Bot" : "Waiting…")}
                </p>
                <p className="text-xs text-muted">
                  {opponentKind === "bot" ? "Bot is ready" : room.members[1] ? "Connected" : "Searching"}
                </p>
              </div>
            </div>

            {opponentKind === "human" && room.members.length > 1 && (
              <div className="mt-4 rounded-2xl bg-surface-2 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MessageCircle className="size-4 text-primary" />
                  <span className="font-semibold text-fg">Match chat</span>
                </div>
                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {log.length ? (
                    log.map((x) => (
                      <p key={x.createdAt + x.userId + x.message} className="text-sm text-fg">
                        <span className="text-muted">@{x.userId === user?.id ? "you" : "opponent"}:</span>{" "}
                        {x.message}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-muted">No comments yet.</p>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void send();
                    }}
                    maxLength={160}
                    className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-fg"
                    placeholder="Write a comment…"
                  />
                  <button type="button" onClick={() => void send()} className="hud-chip text-fg">
                    Send
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {opponentKind === "human" && room.members.length > 1 && (
                <button
                  type="button"
                  onClick={() => startMatch("human", room.roomId)}
                  className="btn-primary"
                >
                  <Swords className="mr-2 size-4" /> Start Match
                </button>
              )}
              {opponentKind === "bot" && (
                <button
                  type="button"
                  onClick={() => startMatch("bot")}
                  className="btn-primary"
                >
                  <Bot className="mr-2 size-4" /> Start Practice Match
                </button>
              )}
              <button type="button" onClick={leave} className="hud-chip min-h-12 justify-center text-fg">
                <RefreshCw className="mr-2 size-4" /> Leave
              </button>
            </div>
          </section>
        )}
      </div>
    </Screen>
  );
}

export default MultiplayerScreen;
