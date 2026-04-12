import { createSignal } from "solid-js";
import * as Tone from "tone";
import { usePlayerContext } from "./context/usePlayerContext";

const useUpperControlPanel = () => {
  const { setTime, bpm, setTotalVolume } = usePlayerContext();
  const [exitModalOpen, setExitModalOpen] = createSignal(false);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const tenths = Math.floor((ms % 1000) / 100);

    return `${minutes}:${seconds.toString().padStart(2, "0")}.${tenths}`;
  };

  const updateTimer = (beat: number) => {
    const secondsPerBeat = 60 / bpm();

    const timeMs = beat * secondsPerBeat * 1000 * 4;

    setTime(formatTime(timeMs));
  };

  const muteOrUnmuteMasterVolume = (e: Event) => {
    if (
      !Tone.getDestination().mute &&
      !(e.currentTarget as HTMLInputElement).checked
    ) {
      Tone.getDestination().mute = true;
      setTotalVolume(0);
    } else {
      Tone.getDestination().mute = false;
      setTotalVolume(50);
    }
  };

  return {
    updateTimer,
    muteOrUnmuteMasterVolume,
    exitModalOpen,
    setExitModalOpen,
  };
};

export default useUpperControlPanel;
