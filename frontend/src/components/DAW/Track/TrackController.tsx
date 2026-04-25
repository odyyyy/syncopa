import { Accessor, Component } from "solid-js";
import { Track } from "../../../types/daw.types";
import { usePresetsContext } from "../../../context/daw/presets.context";
import useTracksManager from "../../../hooks/daw/useTracksManager";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";

interface TrackControllerProps {
  track: Accessor<Track>;
  openPresetsMenu?: () => void;
}

const TrackController: Component<TrackControllerProps> = ({
  track,
  openPresetsMenu,
}) => {
  const { handleTrackVolumeChange, isMuted, setIsMuted } = useTracksManager();
  const { presets } = usePresetsContext();
  const trackPresetName = () => {
    if (track().presetId === 0) return "Аудио-дорожка";
    return track().presetId
      ? presets?.find((p) => p.id === track().presetId)?.title
      : "???";
  };

  const { sendChangeEvent } = useSendChangeEvent();

  return (
    <div
      // onDblClick={track().presetId === 0 ? undefined : openPresetsMenu}
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
        class="text-xs  opacity-50 font-bold uppercase p-1.5 rounded-xl bg-base-200/90 w-fit "
        classList={{
          "cursor-pointer": track().presetId !== 0,
          "text-red-400": track().presetId === 0,
        }}
        onClick={track().presetId === 0 ? undefined : openPresetsMenu}
      >
        {trackPresetName()}
      </span>
      <div class="flex-row flex  gap-5">
        <div class="volume ">
          <input
            type="range"
            min="0"
            max="100"
            value={track().volume ?? 50}
            oninput={(e) => {
              handleTrackVolumeChange(
                Number(e.currentTarget.value),
                track().trackId,
              );
              sendChangeEvent(SyncOperation.UPDATE, Target.TRACK_VOLUME, {
                volume: Number(e.currentTarget.value),
                trackId: track().trackId,
              });
            }}
            class="range range-xs max-w-50 w-50 max-h-4"
          />
        </div>
        <div class="flex-row flex gap-1 mr-1">
          <div class="tooltip tooltip-bottom" data-tip="Заглушить">
            <label class="swap mr-2 bg-base-content/5 rounded-lg p-0.5 w-7 h-7">
              <input
                type="checkbox"
                checked
                onChange={(e) => {
                  if (isMuted()) {
                    handleTrackVolumeChange(Number(50), track().trackId);
                    setIsMuted(false);
                  } else {
                    handleTrackVolumeChange(Number(0), track().trackId);
                    setIsMuted(true);
                  }
                }}
              />
  
              <svg
                class="swap-on fill-current h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
              </svg>
  
              <svg
                class="swap-off fill-current h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
              </svg>
            </label>
          </div>
          {/*<div class="tooltip tooltip-bottom" data-tip="Solo">
            <div class="solo btn-main p-1 rounded-full w-8 ">S</div>
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default TrackController;
