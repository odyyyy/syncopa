import { createSignal, useContext } from "solid-js";
import toast from "solid-toast";
import { useProjectData } from "./useProject";
import { Track } from "../../types/daw.types";

const useMainDawTrackPanel = () => {
  const { tracks, setTracks } = useProjectData();
  const [tactWidth, setTactWidth] = createSignal(180);
  const [tactElementsNumber, setTactElementsNumber] = createSignal(30);

  const addNewTrack = (title: string | undefined = undefined) => {
    if (tracks.length > 50) {
      toast.error("Максимальное количество дорожек достигнуто");
      return;
    }

    if (!title) {
      title = `Дорожка ${tracks.length + 1}`;
    }

    setTracks((prev: Track[]) => [
      ...prev,
      { trackId: tracks.length + 1, title: title, patterns: [], volume: 50 },
    ]);
  };

  const handleOnWheelAndCtrlChangeTactsWidth = (e: WheelEvent) => {
    if (e.ctrlKey) {
      if (e.deltaY < 0) {
        setTactWidth((prev) => Math.min(prev + 20, 400));
      } else {
        setTactWidth((prev) => Math.max(prev - 20, 80));
      }
    }
  };

  const onTrackVolumeChange = (
    e: Event & {
      currentTarget: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    },
    trackId: number,
  ) => {
    const trackIndex = tracks.findIndex((t) => t.trackId === trackId);

    setTracks(trackIndex, (prev) => ({
      ...prev,
      volume: Number(e.currentTarget.value),
    }));
  };

  return {
    tracks,
    tactWidth,
    tactElementsNumber,
    handleOnWheelAndCtrlChangeTactsWidth,
    addNewTrack,
    setTracks,
    onTrackVolumeChange,
  };
};

export default useMainDawTrackPanel;
