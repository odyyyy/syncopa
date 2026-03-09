import { createContext, ParentComponent, createSignal } from "solid-js";
import { PlayerContextType } from "../../types/daw.types";

export const PlayerContext = createContext<PlayerContextType>();

export const PlayerProvider: ParentComponent = (props) => {
  const [time, setTime] = createSignal<string>("00:00.0");
  const [bpm, setBpm] = createSignal<number>(120);
  const [playerBeatPos, setPlayerBeatPos] = createSignal<number>(0);
  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);
  const [tactElementsNumber, setTactElementsNumber] = createSignal(30);
  
  
  const [intervalId, setIntervalId] = createSignal<number | undefined>(
    undefined,
  );
  
  const startOrPausePlaying = () => {
    setIsPlaying(!isPlaying());

    if (!isPlaying()) {
      clearInterval(intervalId());
    } else {
      const interval = setInterval(() => {
        setPlayerBeatPos(playerBeatPos() + 60 / bpm() / 100);
      }, 10);
      setIntervalId(interval);
    }
  };

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
        startOrPausePlaying,
        tactElementsNumber,
        setTactElementsNumber,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};
