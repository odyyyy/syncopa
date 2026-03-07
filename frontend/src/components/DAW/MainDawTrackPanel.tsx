import { Component, For, Index } from "solid-js";
import TrackController from "./TrackController";
import Track from "./Track";
import BaseTactsGrid from "./BaseTactsGrid";
import useMainDawTrackPanel from "../../hooks/daw/useTracksManagerPanel";
import { useProjectData } from "../../hooks/daw/useProject";

const MainDawTrackPanel: Component = () => {
  const {
    tactWidth,
    tactElementsNumber,
    handleOnWheelAndCtrlChangeTactsWidth,
    addNewTrack,
  } = useMainDawTrackPanel();

  const { tracks, setTracks, project } = useProjectData();
  setTracks(project()?.payload?.tracks ?? [])
  
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
          class="bg-base-200 h-full grid grid-flow-row place-content-start overflow-x-auto overflow-y-hidden"
          onWheel={handleOnWheelAndCtrlChangeTactsWidth}
        >
          <BaseTactsGrid
            tactElementsNumber={tactElementsNumber}
            width={tactWidth}
          />
          <input
            type="range"
            min="0"
            max="1000"
            value="0"
            class="range range-xs w-full max-h-4 size-0.5 z-10 "
          />
          <Index each={tracks}>
            {(track) => <Track tactElementsNumber={tactElementsNumber()} />}
          </Index>
        </div>
      </div>
    </div>
  );
};

export default MainDawTrackPanel;
