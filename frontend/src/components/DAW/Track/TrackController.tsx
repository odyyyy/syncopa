import { Accessor, Component, Show } from "solid-js";
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
  const { handleTrackVolumeChange, isMuted, setIsMuted } =
    useTracksManager();

  const { presets } = usePresetsContext();
  const { sendChangeEvent } = useSendChangeEvent();

  const trackPresetName = () => {
    if (track().presetId === -1) return "Аудио-дорожка";

    return track().presetId
      ? presets?.find((p) => p.id === track().presetId)?.title
      : "Неизвестный пресет";
  };

  return (
    <div class="flex flex-col justify-between h-26 w-full px-3 py-2.5 bg-base-200/60 backdrop-blur-md border-b border-base-content/5 shadow-inner transition-all">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <div
            class={`flex items-center justify-center size-9 rounded-2xl border shadow-sm transition-all ${
              track().presetId === -1
                ? "bg-error/10 border-error/20 text-error"
                : "bg-primary/10 border-primary/20 text-primary hover:scale-105 cursor-pointer"
            }`}
            onClick={
              track().presetId === -1 ? undefined : openPresetsMenu
            }
          >
            <Show
              when={track().presetId !== -1}
              fallback={
                <svg
                  viewBox="0 0 24 24"
                  class="size-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13 4v16a1 1 0 0 1-2 0V4a1 1 0 0 1 2 0M8 5a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1M4 7a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1m12-2a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1m4 2a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1" />
                </svg>
              }
            >
              <svg
                viewBox="0 0 48 48"
                class="size-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="19" cy="33" r="9" />
                <polygon points="24,6 24,33 28,33 28,14 39,17 39,10" />
              </svg>
            </Show>
          </div>

          <div class="flex flex-col min-w-0">
            <input
              class="bg-transparent text-sm font-bold tracking-tight outline-none border-none p-0 truncate"
              type="text"
              value={track().title}
              disabled
            />

            <span
              class="text-[10px] uppercase font-black tracking-wider opacity-60 truncate"
              classList={{
                "cursor-pointer hover:opacity-100":
                  track().presetId !== -1,
                "text-error": track().presetId === -1,
              }}
              onClick={
                track().presetId === -1
                  ? undefined
                  : openPresetsMenu
              }
            >
              {trackPresetName()}
            </span>
          </div>
        </div>

      </div>

      <div class="flex items-center gap-3 mt-3">
        <div class="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={track().volume ?? 50}
            onInput={(e) => {
              const volume = Number(e.currentTarget.value);

              handleTrackVolumeChange(volume, track().trackId);

              sendChangeEvent(
                SyncOperation.UPDATE,
                Target.TRACK_VOLUME,
                {
                  volume,
                  trackId: track().trackId,
                },
              );
            }}
            class="range range-base-content range-xs w-full"
          />
        </div>

        <div>
          <button
            class={`btn btn-xs btn-square rounded-xl transition-all ${
              isMuted()
                ? "btn-error text-error-content"
                : "btn-ghost hover:bg-base-content/10"
            }`}
            onClick={() => {
              if (isMuted()) {
                handleTrackVolumeChange(50, track().trackId);
                setIsMuted(false);
              } else {
                handleTrackVolumeChange(0, track().trackId);
                setIsMuted(true);
              }
            }}
          >
            <Show
              when={!isMuted()}
              fallback={
                <svg
                  class="size-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
                </svg>
              }
            >
              <svg
                class="size-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
              </svg>
            </Show>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackController;