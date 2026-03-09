import { useContext } from "solid-js";
import { PlayerContext } from "../../../context/daw/player.context";

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("PlayerContext не найден");
  }
  return context;
}
