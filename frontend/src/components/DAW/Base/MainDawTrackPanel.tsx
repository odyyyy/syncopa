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
import TrackInstrumentChooseModal from "../Track/TrackInstrumentChooseModal";
import PresetChooseModal from "../PianoRoll/PresetChooseModal";
import { usePresetsContext } from "../../../context/daw/presets.context";

const MainDawTrackPanel: Component = () => {
  const {
    tactWidth,
    handleOnWheelAndCtrlChangeTactsWidth,
    addNewTrack,
    handlePlayerHeadChangePos,
    handleContextMenu,
  } = useMainDawTrackPanel();

  const { setAndLoadSelectedPresetInModal, setPresetModalState } =
    usePresetsContext();
  const { tracks } = useProjectContext();
  const { tactElementsNumber } = usePlayerContext();
  const { isPianoRollOpen, pianoRollHeight } = usePianoRollContext();

  const {
    handlePlayerForward,
    handlePlayerBackward,
    handlePlayerStartOrPause,
  } = useHotkeysGlobalEvents();

  let mainTracksPanelRef: HTMLDivElement | undefined;

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

  let chooseTrackInstrumentRef: HTMLDialogElement | undefined;
  let choosePresetRef: HTMLDialogElement | undefined;

  return (
    <div
      class="grid grid-flow-row h-full w-full overflow-y-hidden animate-fade-smooth "
      classList={{ "grid-flow-auto": !isPianoRollOpen() }}
      style={{
        "grid-template-rows": isPianoRollOpen()
          ? `1fr ${pianoRollHeight()}px`
          : "1fr",
      }}
    >
      <div class="grid  grid-cols-[1fr_4fr] w-full overflow-y-auto overflow-x-hidden">
        <div class="bg-base-200 h-full min-w-70 border-r drop-shadow-xs border-r-base-300 ">
          <button
            class="btn-main sticky top-0 z-100 bg-base-300 hover:bg-base-200 text-base w-full h-10"
            onClick={() => chooseTrackInstrumentRef?.showModal()}
          >
            + Добавить дорожку
          </button>
          <Index each={tracks}>
            {(track) => (
              <TrackController
                track={track}
                openPresetsMenu={() => {
                  choosePresetRef?.showModal();
                  setPresetModalState({
                    trackId: track().trackId,
                    presetId: track().presetId,
                  });
                }}
              />
            )}
          </Index>
        </div>

        <TrackInstrumentChooseModal
          modalRef={(el) => (chooseTrackInstrumentRef = el)}
          onSelect={(instrumentChoice) => {
            if (!instrumentChoice) return;
            addNewTrack(undefined, instrumentChoice);
          }}
        />

        <PresetChooseModal
          modalRef={(el) => (choosePresetRef = el)}
          onSelect={(presetId) => {
            setAndLoadSelectedPresetInModal(presetId)
          }}
        />
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
        <PianoRoll />
      </Show>
    </div>
  );
};

export default MainDawTrackPanel;
