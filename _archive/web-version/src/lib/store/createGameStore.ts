import { useGame } from "../store";
export { useGame };
export type GameStore = ReturnType<typeof useGame.getState>;
