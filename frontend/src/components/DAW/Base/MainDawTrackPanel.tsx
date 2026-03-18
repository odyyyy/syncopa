import { Component, Index, onCleanup, onMount, Show } from "solid-js";
import TrackController from "../Track/TrackController";
import BaseTactsGrid from "../Track/BaseTactsGrid";
import useMainDawTrackPanel from "../../../hooks/daw/useTracksManagerPanel";
import { useProjectContext } from "../../../hooks/daw/context/useProjectContext";
import { usePlayerContext } from "../../../hooks/daw/context/usePlayerContext";
import useHotkeysGlobalEvents from "../../../hooks/daw/hotkeys/useHotkeysGlobalEvents";
import { Track } from "../Track/Track";
import PlayerHead from "../Track/PlayerHead";
import PianoRoll from "../PianoRoll/PianoRoll";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";

const MainDawTrackPanel: Component = () => {
  const {
    tactWidth,
    handleOnWheelAndCtrlChangeTactsWidth,
    addNewTrack,
    handlePlayerHeadChangePos,
    handleContextMenu,
  } = useMainDawTrackPanel();

  const { tracks, setTracks, project } = useProjectContext();
  const { tactElementsNumber } = usePlayerContext();
  const { isPianoRollOpen } = usePianoRollContext();
  
  
  
  const {
    handlePlayerForward,
    handlePlayerBackward,
    handlePlayerStartOrPause,
  } = useHotkeysGlobalEvents();

  let mainTracksPanelRef: HTMLDivElement | undefined;

  setTracks(project()?.payload?.tracks ?? []);

  onMount(() => {
    document.addEventListener("keydown", handlePlayerForward);
    document.addEventListener("keydown", handlePlayerBackward);
    document.addEventListener("keydown", handlePlayerStartOrPause);
  });
  onCleanup(() => {
    document.removeEventListener("keydown", handlePlayerForward);
    document.removeEventListener("keydown", handlePlayerBackward);
    document.removeEventListener("keydown", handlePlayerStartOrPause);
  });

  return (
    <div class="grid grid-rows-auto grid-flow-row h-full w-full overflow-y-hidden animate-fade-smooth ">
      <div class="grid  grid-cols-[1fr_4fr] w-full flex-1  min-h-0 overflow-y-auto overflow-x-hidden">
        <div class="bg-base-200 h-full min-w-70 border-r drop-shadow-xs border-r-base-300 ">
          <button
            class="btn-main sticky top-0 z-100 bg-base-300 hover:bg-base-200 text-base w-full h-10"
            onClick={() => addNewTrack()}
          >
            + Добавить дорожку
          </button>
          <Index each={tracks}>
            {(track) => <TrackController track={track()} />}
          </Index>
        </div>

        <div
          class="relative bg-base-200 h-full grid grid-flow-row place-content-start overflow-x-auto overflow-y-hidden"
          ref={mainTracksPanelRef}
          onWheel={handleOnWheelAndCtrlChangeTactsWidth}
          onContextMenu={handleContextMenu}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest(".pattern")) return;
            handlePlayerHeadChangePos(e, mainTracksPanelRef);
          }}
        >
          <BaseTactsGrid
            tactElementsNumber={tactElementsNumber}
            width={tactWidth}
          />

          <PlayerHead />

          <Index each={tracks}>
            {(track) => (
              <Track
                trackId={track().trackId}
                patterns={track().patterns ?? []}
                tactElementsNumber={tactElementsNumber()}
              />
            )}
          </Index>
        </div>
      </div>
      <Show when={isPianoRollOpen()}>
        <PianoRoll patternWidth={() => 5} />
      </Show>
    </div>
  );
};

export default MainDawTrackPanel;
