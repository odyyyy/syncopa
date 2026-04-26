import { Component, Index, onCleanup, onMount, Show } from "solid-js";
import TrackController from "../Track/TrackController";
import BaseTactsGrid from "../Track/BaseTactsGrid";
import useMainDawWorkspace from "../../../hooks/daw/useMainDawWorkspace";
import { useProjectContext } from "@/context/daw/project.context";
import useHotkeysGlobalEvents from "../../../hooks/daw/hotkeys/useHotkeysGlobalEvents";
import { Track } from "../Track/Track";
import PlayerHead from "../Track/PlayerHead";
import PianoRoll from "../PianoRoll/PianoRoll";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import TrackInstrumentChooseModal from "../Track/TrackInstrumentChooseModal";
import PresetChooseModal from "../Preset/PresetChooseModal";
import { usePresetsContext } from "../../../context/daw/presets.context";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";
import useTracksManager from "../../../hooks/daw/useTracksManager";
import useSwitchPreset from "../../../hooks/daw/preset/useSwitchPreset";
import { useTimelineContext } from "@/context/daw/timeline.context";
import useProjectAutoSave from "@/hooks/daw/project/useProjectAutoSave";
import useProjectManager from "@/hooks/daw/project/useProjectManager";
import useEffectsManager from "@/hooks/daw/effect/useEffectsManager";

const MainDawWorkspace: Component = () => {
  let mainTracksPanelRef: HTMLDivElement | undefined;
  let chooseTrackInstrumentRef: HTMLDialogElement | undefined;
  let choosePresetRef: HTMLDialogElement | undefined;

  const {
    tactWidth,
    handleOnWheelAndCtrlChangeTactsWidth,
    handlePlayerHeadChangePos,
    handleContextMenu,
  } = useMainDawWorkspace();
  const { setPresetModalState } = usePresetsContext();
  const { selectPresetFromModal } = useSwitchPreset();
  const { tracks } = useProjectContext();
  const { tactElementsNumber } = useTimelineContext();
  const { isPianoRollOpen, pianoRollHeight } = usePianoRollContext();

  const { initializeProjectEffects } = useEffectsManager();
  onMount(async() => {
    const audioPatternsIds = tracks.reduce((ids, track) => {
      track.patterns?.forEach((p) => {
        if (p.type === "audio") ids.push(p.patternId);
      });
      return ids;
    }, [] as string[]);

    if (audioPatternsIds && audioPatternsIds.length !== 0) {
      loadAudioPatternsUsedInProject(audioPatternsIds);
    }
    initializeProjectEffects(tracks);
  });
  useProjectAutoSave();

  const { addNewTrack } = useTracksManager();
  const { loadAudioPatternsUsedInProject } = useProjectManager();

  const {
    handlePlayerForward,
    handlePlayerBackward,
    handlePlayerStartOrPause,
  } = useHotkeysGlobalEvents();

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

  const { sendChangeEvent } = useSendChangeEvent();

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
          dialogRef={(el) => (chooseTrackInstrumentRef = el)}
          onSelect={(instrumentChoice) => {
            if (!instrumentChoice) return;
            const newTrack = addNewTrack(undefined, instrumentChoice);
            if (!newTrack) return;

            sendChangeEvent(SyncOperation.CREATE, Target.TRACK, {
              track: newTrack,
            });
          }}
        />

        <PresetChooseModal
          dialogRef={(el) => (choosePresetRef = el)}
          onSelect={(presetId) => {
            selectPresetFromModal(presetId);
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

export default MainDawWorkspace;
