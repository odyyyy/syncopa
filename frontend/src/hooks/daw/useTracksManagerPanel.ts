import { createEffect, createSignal } from "solid-js";
import toast from "solid-toast";
import { useProjectContext } from "./context/useProjectContext";
import { Track } from "../../types/daw.types";
import useUpperControlPanel from "./useUpperControlPanel";
import { usePlayerContext } from "./context/usePlayerContext";
import { useContextMenu } from "../../context/daw/contextmenu.context";
import { useTracksContext } from "./context/useTracksContext";
import usePatternManage from "./pattern/usePatternManage";
import { PRESETS_CATEGORIES_ENUM } from "../../components/DAW/PianoRoll/PresetChooseModal";
import { usePresetsContext } from "../../context/daw/presets.context";

const useMainDawTrackPanel = () => {
  const { tracks, setTracks } = useProjectContext();
  const { playerBeatPos, setPlayerBeatPos } = usePlayerContext();
  const { tactWidth, setTactWidth } = useTracksContext();

  const [playerHeadPos, setPlayerHeadPos] = createSignal<number>(0);
  const [isPlaying, setIsPlaying] = createSignal(false);

  const finalPlayerHeadPos = () => playerBeatPos() * tactWidth();
  const { updateTimer } = useUpperControlPanel();
  createEffect(() => {
    updateTimer(playerBeatPos());
  });

  const { setAndLoadSelectedPreset } = usePresetsContext();
  const addNewTrack = (
    title: string | undefined = undefined,
    presetCategory: string,
  ) => {
    if (tracks.length > 50) {
      toast.error("Максимальное количество дорожек достигнуто");
      return;
    }

    if (!title) {
      title = `Дорожка ${tracks.length + 1}`;
    }

    const trackId = crypto.randomUUID();
    const presetId = getDefaultPresetIdByCategory(presetCategory);

    setTracks((prev: Track[]) => [
      ...prev,
      {
        trackId: trackId,
        presetId: presetId,
        title: title,
        patterns: [],
        volume: 50,
      },
    ]);
    setAndLoadSelectedPreset(presetId, trackId);
  };

  const getDefaultPresetIdByCategory = (category: string): number => {
    switch (category) {
      case PRESETS_CATEGORIES_ENUM.LEAD:
        return 6;
      case PRESETS_CATEGORIES_ENUM.PAD:
        return 7;
      case PRESETS_CATEGORIES_ENUM.GUITAR:
        return 8;
      case PRESETS_CATEGORIES_ENUM.DRUM:
        return 9;
      case PRESETS_CATEGORIES_ENUM.KEY:
        return 10;
      default:
        return 6;
    }
  };

  const handleOnWheelAndCtrlChangeTactsWidth = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();

      if (e.deltaY < 0) {
        setTactWidth((prev: number) => Math.min(prev + 20, 400));
      } else {
        setTactWidth((prev: number) => Math.max(prev - 20, 80));
      }
    }
  };

  const handlePlayerHeadChangePos = (
    e: MouseEvent,
    mainTracksPanelRef: HTMLDivElement | undefined,
  ) => {
    const rect = mainTracksPanelRef!.getBoundingClientRect();
    const x = e.clientX - rect.left + mainTracksPanelRef!.scrollLeft;
    const beat = x / tactWidth();
    setPlayerBeatPos(beat);
  };

  const onTrackVolumeChange = (
    e: Event & {
      currentTarget: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    },
    trackId: string,
  ) => {
    const trackIndex = tracks.findIndex((t) => t.trackId === trackId);

    setTracks(trackIndex, (prev) => ({
      ...prev,
      volume: Number(e.currentTarget.value),
    }));
  };

  const { openMenu } = useContextMenu();
  const { addPatternOnTrack } = usePatternManage();

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openMenu(e.clientX, e.clientY, [
      {
        label: "Добавить паттерн",
        icon: "+",
        onClick: () => {
          const trackId = (
            (e.target as HTMLElement).closest(".track") as HTMLElement
          )?.dataset.trackId;
          if (!trackId) return;
          addPatternOnTrack(trackId);
        },
      },
      {
        label: "Удалить дорожку",
        icon: "−",
        onClick: () => {
          const trackId = (
            (e.target as HTMLElement).closest(".track") as HTMLElement
          )?.dataset.trackId;
          if (!trackId) return;
          const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
          if (trackIndex === -1) return;
          setTracks((prev) => prev.filter((_, i) => i !== trackIndex));
        },
      },
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
    handlePlayerHeadChangePos,
  };
};

export default useMainDawTrackPanel;
