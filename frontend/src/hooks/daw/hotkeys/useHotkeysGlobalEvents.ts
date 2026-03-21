import { usePlayerContext } from "../context/usePlayerContext";

const useHotkeysGlobalEvents = () => {
  const { bpm, playerBeatPos, setPlayerBeatPos, tactElementsNumber } =
    usePlayerContext();

  const { startOrPausePlaying } = usePlayerContext();

  const handlePlayerForward = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.code === "KeyW" || e.code === "ArrowRight") {
      const delta = 60 / bpm();
      if (playerBeatPos() + delta <= tactElementsNumber()) {
        setPlayerBeatPos(playerBeatPos() + delta / 2);
      } else if (playerBeatPos() + delta > tactElementsNumber()) {
        setPlayerBeatPos(tactElementsNumber());
      }
    }
  };

  const handlePlayerBackward = (event: KeyboardEvent) => {
    if (event.code === "KeyS" || event.code === "ArrowLeft") {
      const delta = 60 / bpm();
      if (playerBeatPos() - delta >= 0) {
        setPlayerBeatPos(playerBeatPos() - delta / 2);
      } else if (playerBeatPos() - delta < 0) {
        setPlayerBeatPos(0);
      }
    }
  };

  const handlePlayerStartOrPause = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      startOrPausePlaying();
    }
  };

  return {
    handlePlayerForward,
    handlePlayerBackward,
    handlePlayerStartOrPause,
  };
};

export default useHotkeysGlobalEvents;
