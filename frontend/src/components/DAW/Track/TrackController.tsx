import { Accessor, Component } from "solid-js";
import useMainDawTrackPanel from "../../../hooks/daw/useTracksManagerPanel";
import { Track } from "../../../types/daw.types";
import { usePresetsContext } from "../../../context/daw/presets.context";

interface TrackControllerProps {
  track: Accessor<Track>;
  openPresetsMenu?: () => void;
}

const TrackController: Component<TrackControllerProps> = ({
  track,
  openPresetsMenu,
}) => {
  const { onTrackVolumeChange } = useMainDawTrackPanel();
  const { presets } = usePresetsContext();
  const trackPresetName = () => {
    return track().presetId
      ? presets?.find((p) => p.id === track().presetId)?.title
      : "???";
  };

  return (
    <div
      onDblClick={openPresetsMenu}
      class="flex flex-col h-25 max-h-30 w-full bg-base-100/22  justify-between p-2 border-b border-b-base-300 "
    >
      <div class="flex justify-start ">
        <div class="flex items-center gap-2 justify-center stroke-black stroke-2 fill-current ">
          <svg
            viewBox="0 0 48 48"
            onClick={openPresetsMenu}
            class="h-6 w-6 stroke-base-content cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 48 48"
          >
            <circle cx="19" cy="33" r="9" />
            <polygon points="24,6 24,33 28,33 28,14 39,17 39,10" />
          </svg>

          <input
            class="text-base w-fit selection:bg-base-content/15 cursor-pointer focus-visible:border-none outline-none  border-none user-select-none"
            type="text"
            value={track().title}
            disabled
            onChange={(e) => (track().title = e.target.value)}
          />
        </div>
      </div>
      <span
        class="text-xs  opacity-50 font-bold uppercase p-1.5 rounded-xl bg-base-200/90 w-fit cursor-pointer"
        onClick={openPresetsMenu}
      >
        {trackPresetName()}
      </span>
      <div class="flex-row flex justify-between ">
        <div class="volume ">
          <input
            type="range"
            min="0"
            max="100"
            value={track().volume ?? 50}
            oninput={(e) => onTrackVolumeChange(e, track().trackId)}
            class="range range-xs max-w-50 w-50 max-h-4"
          />
        </div>
        <div class="flex-row flex gap-2 mr-1">
          <div class="tooltip tooltip-bottom" data-tip="Заглушить">
            <div class="mute btn-main p-1 rounded-full w-8">M</div>
          </div>
          <div class="tooltip tooltip-bottom" data-tip="Solo">
            <div class="solo btn-main p-1 rounded-full w-8 ">S</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackController;
