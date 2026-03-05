import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";

const useTracksManagerPanel = () => {
  const [tracks, setTracks] = createStore([
    {
      id: 1,
      name: "Track 1",
      elements: [],
    },
    {
      id: 2,
      name: "Track 2",
      elements: [],
    },
  ]);

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
    if (!title.trim()) return;
    setTracks((prev) => [
      ...prev,
      { id: tracks.length + 1, name: title, elements: [] },
    ]);
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      if (e.deltaY < 0) {
        setTactWidth((prev) => Math.min(prev + 20, 400));
      } else {
        setTactWidth((prev) => Math.max(prev - 20, 80));
      }
    }
  };

  return {
    tracks,
    tactWidth,
    tactElementsNumber,
    handleWheel,
    addNewTrack,
  };
};

export default useTracksManagerPanel;
