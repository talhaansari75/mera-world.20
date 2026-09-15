import { gameEvents } from "@/lib/game/core/eventBus";
import { incrementV14Progress } from "./liveOpsService";

export function installV14LiveOpsBridge() {
  const offFound = gameEvents.on("word:found", () => incrementV14Progress("words"));
  const offComplete = gameEvents.on("level:complete", () => incrementV14Progress("clears"));
  return () => { offFound(); offComplete(); };
}
