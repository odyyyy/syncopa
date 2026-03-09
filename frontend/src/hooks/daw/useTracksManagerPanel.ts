import { createEffect, createSignal, useContext } from "solid-js";
import toast from "solid-toast";
import { useProjectContext } from "./context/useProjectContext";
import { Track } from "../../types/daw.types";
import useUpperControlPanel from "./useUpperControlPanel";
import { usePlayerContext } from "./context/usePlayerContext";
import { useContextMenu } from "../../context/daw/contextmenu.context";

const useMainDawTrackPanel = () => {
  const { tracks, setTracks } = useProjectContext();
  const { playerBeatPos, setPlayerBeatPos } = usePlayerContext();

  const [tactWidth, setTactWidth] = createSignal(180);
  const [playerHeadPos, setPlayerHeadPos] = createSignal<number>(0);
  const [isPlaying, setIsPlaying] = createSignal(false);

  const finalPlayerHeadPos = () => playerBeatPos() * tactWidth();
  const { updateTimer } = useUpperControlPanel();
  createEffect(() => {
    updateTimer(playerBeatPos());
  });

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

  const { openMenu } = useContextMenu();
  
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    openMenu(e.clientX, e.clientY, [
      { label: "Добавить паттерн", onClick: () => {} },
      { label: "Удалить дорожку", onClick: () => setTracks(prev => prev.slice(0, -1)) }
    ]);
    
    
  };

  return {
    tracks,
    tactWidth,
    handleOnWheelAndCtrlChangeTactsWidth,
    addNewTrack,
    setTracks,
    onTrackVolumeChange,
    playerHeadPos,
    setPlayerHeadPos,
    isPlaying,
    setIsPlaying,
    finalPlayerHeadPos,
    playerBeatPos,
    setPlayerBeatPos,
    handleContextMenu,
  };
};

export default useMainDawTrackPanel;
