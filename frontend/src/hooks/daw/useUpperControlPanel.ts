import { MIN_MASTER_VOLUME_DB } from "../../config/config";
import { usePlayerContext } from "./context/usePlayerContext";
import * as Tone from "tone";

const useUpperControlPanel = () => {
  const { setTime, bpm, setTotalVolume } = usePlayerContext();

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

  const changeMasterVolume = (newVolume: number) => {
    Tone.getDestination().volume.value =
      (newVolume * -MIN_MASTER_VOLUME_DB) / 100 + MIN_MASTER_VOLUME_DB;
    setTotalVolume(newVolume);
  };

  const muteOrUnmuteMasterVolume = (e: Event) => {
    console.log(Tone.getDestination().mute)
    console.log((e.currentTarget as HTMLInputElement).checked)
    if (!Tone.getDestination().mute && !(e.currentTarget as HTMLInputElement).checked) {
      Tone.getDestination().mute = true;
      setTotalVolume(0);
    } else if (Tone.getDestination().mute && (e.currentTarget as HTMLInputElement).checked) {
      Tone.getDestination().mute = false;
      setTotalVolume(50);
    }
  };

  return {
    updateTimer,
    changeMasterVolume,
    muteOrUnmuteMasterVolume,
  };
};

export default useUpperControlPanel;
