import {
  createContext,
  ParentComponent,
  createSignal,
  createEffect,
  useContext,
} from "solid-js";
import { PlayerContextType } from "../../types/daw.types";
import * as Tone from "tone";
import { useProjectContext } from "@/context/daw/project.context";

const PlayerContext = createContext<PlayerContextType>();

export const PlayerProvider: ParentComponent = (props) => {
  const [time, setTime] = createSignal<string>("00:00.0");

  const { project } = useProjectContext();
  const [bpm, setBpm] = createSignal<number>(
    project()?.payload.metadata?.bpm ?? 120,
  );

  const [playerBeatPos, setPlayerBeatPos] = createSignal<number>(0);
  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

  const [totalVolume, setTotalVolume] = createSignal(
    project()?.payload?.metadata?.totalVolume ?? 50,
  );

  createEffect(() => {
    Tone.getDestination().volume.value = volumeToDb(totalVolume());
  });

  return (
    <PlayerContext.Provider
      value={{
        time,
        setTime,
        bpm,
        setBpm,
        playerBeatPos,
        setPlayerBeatPos,
        isPlaying,
        setIsPlaying,
        totalVolume,
        setTotalVolume,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("PlayerContext не найден");
  }
  return context;
}

export const volumeToDb = (value: number) => {
  const linear = value / 100;

  if (linear <= 0) return -Infinity;

  return 20 * Math.log10(linear);
};
