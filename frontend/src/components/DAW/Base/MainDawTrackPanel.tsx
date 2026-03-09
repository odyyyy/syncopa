import { Component, Index, onCleanup, onMount } from "solid-js";
import TrackController from "../Track/TrackController";
import Track from "../Track/Track";
import BaseTactsGrid from "../Track/BaseTactsGrid";
import useMainDawTrackPanel from "../../../hooks/daw/useTracksManagerPanel";
import { useProjectContext } from "../../../hooks/daw/context/useProjectContext";
import { usePlayerContext } from "../../../hooks/daw/context/usePlayerContext";
import useHotkeysGlobalEvents from "../../../hooks/daw/hotkeys/useHotkeysGlobalEvents";

const MainDawTrackPanel: Component = () => {
  const {
    tactWidth,
    handleOnWheelAndCtrlChangeTactsWidth,
    addNewTrack,
    finalPlayerHeadPos,
    setPlayerBeatPos,
    handleContextMenu,
  } = useMainDawTrackPanel();
  
  const { tracks, setTracks, project } = useProjectContext();
  const { tactElementsNumber } = usePlayerContext();
  const {
    handlePlayerForward,
    handlePlayerBackward,
    handlePlayerStartOrPause,
  } = useHotkeysGlobalEvents();

  let playerHeadRef: HTMLSpanElement | undefined;
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
          onClick={(e: MouseEvent) => {
            const rect = mainTracksPanelRef!.getBoundingClientRect();
            const x = e.clientX - rect.left + mainTracksPanelRef!.scrollLeft;
            const beat = x / tactWidth();

            setPlayerBeatPos(beat);
          }}
        >
          <BaseTactsGrid
            tactElementsNumber={tactElementsNumber}
            width={tactWidth}
          />

          <span
            class="absolute top-0 bottom-0 w-1 bg-base-content/35 pointer-events-none"
            ref={playerHeadRef}
            style={{ left: `${finalPlayerHeadPos()}px` }}
          ></span>

          <Index each={tracks}>
            {(track) => <Track tactElementsNumber={tactElementsNumber()} />}
          </Index>
        </div>
      </div>
    </div>
  );
};

export default MainDawTrackPanel;
