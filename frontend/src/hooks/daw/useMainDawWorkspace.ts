import { createEffect, createSignal } from "solid-js";
import { useProjectContext } from "@/context/daw/project.context";
import useUpperControlPanel from "./useUpperControlPanel";
import { usePlayerContext } from "@/context/daw/player.context";
import { useContextMenu } from "../../context/daw/contextmenu.context";
import usePatternManager from "./pattern/usePatternManager";
import { useSendChangeEvent } from "../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../types/coop.types";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { PatternVST } from "@/types/daw.types";
import { useClipboardContext } from "@/context/daw/clipboard.context";

const useMainDawWorkspace = () => {
  const { tracks, setTracks } = useProjectContext();
  const { playerBeatPos, setPlayerBeatPos } = usePlayerContext();
  const { tactWidth, setTactWidth } = useTimelineContext();

  const [playerHeadPos, setPlayerHeadPos] = createSignal<number>(0);
  const [isPlaying, setIsPlaying] = createSignal(false);

  const finalPlayerHeadPos = () => playerBeatPos() * tactWidth();
  const { updateTimer } = useUpperControlPanel();
  createEffect(() => {
    updateTimer(playerBeatPos());
  });

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

  const { openMenu } = useContextMenu();
  const { addPatternOnTrack } = usePatternManager();
  const { sendChangeEvent } = useSendChangeEvent();
  const { clipboard } = useClipboardContext();

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const trackEl = (e.target as HTMLElement).closest(".track") as HTMLElement;
    const trackId = trackEl?.dataset.trackId;

    const track = tracks.find((t) => t.trackId === trackId);

    openMenu(e.clientX, e.clientY, [
      ...(track && track.presetId !== -1
        ? [
            {
              label: "Добавить паттерн",
              icon: "+",
              onClick: () => {
                const patternId = crypto.randomUUID();
                const newPattern: PatternVST = {
                  patternId,
                  type: "vst",
                  pos: 0,
                  width: 1,
                  title: "Pattern",
                  notes: [],
                };

                const pattern = addPatternOnTrack(trackId!, newPattern);
                if (!pattern) return;

                sendChangeEvent(SyncOperation.CREATE, Target.PATTERN, {
                  type: pattern.type,
                  trackId,
                  pattern: pattern,
                });
              },
            },
            clipboard()
              ? {
                  label: "Вставить",
                  icon: "⇧",
                  onClick: () => {
                    if (!clipboard() || !trackId || clipboard()?.type !== "vst")
                      return;

                    const rect = trackEl.getBoundingClientRect();
                    const posX = e.clientX - rect.left + trackEl.scrollLeft;

                    const copiedPattern = {
                      ...(clipboard() as PatternVST),
                      patternId: crypto.randomUUID(),
                      pos: posX / tactWidth(),
                    };

                    const newPattern = addPatternOnTrack(
                      trackId,
                      copiedPattern,
                    );
                    if (!newPattern) return;

                    sendChangeEvent(SyncOperation.CREATE, Target.PATTERN, {
                      type: copiedPattern.type,
                      trackId,
                      pattern: newPattern,
                    });
                  },
                }
              : null,
          ].filter(Boolean)
        : []),

      {
        label: "Удалить дорожку",
        icon: "−",
        onClick: () => {
          if (!trackId) return;

          const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
          if (trackIndex === -1) return;

          setTracks((prev) => prev.filter((_, i) => i !== trackIndex));

          sendChangeEvent(SyncOperation.REMOVE, Target.TRACK, {
            trackId,
          });
        },
      },
    ]);
  };

  return {
    tracks,
    tactWidth,
    handleOnWheelAndCtrlChangeTactsWidth,
    setTracks,
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

export default useMainDawWorkspace;
