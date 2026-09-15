import { installOfflineMutationBridge, enqueueMutation } from "./offlineMutationQueue";
import { flushLeaderboard } from "./leaderboardRetry";
import { gameEvents } from "@/lib/game/core/eventBus";
import { useGame } from "@/lib/store";
let cleanup:undefined|(()=>void);
export function installV18Offline(){if(typeof window==="undefined")return;cleanup?.();cleanup=installOfflineMutationBridge();const off=gameEvents.on("save:changed",()=>{try{enqueueMutation("save",JSON.parse(useGame.getState().exportJson()))}catch{}});const onOnline=()=>void flushLeaderboard();window.addEventListener("online",onOnline);void flushLeaderboard();const old=cleanup;cleanup=()=>{old();off();window.removeEventListener("online",onOnline)}}
