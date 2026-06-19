import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import usePatternTransform from "../../../hooks/daw/pattern/usePatternTransform";
import {
  PatternAudio,
  PatternType,
  PatternVST,
} from "../../../types/daw.types";
import { Accessor } from "solid-js";
import usePatternManager from "../../../hooks/daw/pattern/usePatternManager";
import usePianoRoll from "../../../hooks/daw/pianoroll/usePianoRoll";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import usePatternContextMenu from "../../../hooks/daw/pattern/usePatternContextMenu";
import AudioPatternWaveform from "./AudioPatternWaveform";
import * as Tone from "tone";
import { audioEngine } from "@/instruments/audioEngine";

const Pattern: Component<{
  pattern: Accessor<PatternType>;
  trackId: string;
}> = (props) => {
  const {
    isGrabbing,
    patternPos,
    patternWidth,
    handlePatternGlobalMouseMove,
    handlePatternGlobalMouseUp,
    startResizeLeft,
    startResizeRight,
    startGrab,
    patternWidthInTacts,
  } = usePatternTransform(props.pattern, props.trackId);
  const { editPattern } = usePatternManager();

  const { handlePatternContextMenu } = usePatternContextMenu();
  const { ROWS_NUMBER, PIANOROLL_NOTES } = usePianoRoll();
  const { setCurrentPatternWidthInTacts, currentPatternAndTrackId } =
    usePianoRollContext();
  createEffect(() => {
    if (currentPatternAndTrackId.patternId === props.pattern().patternId) {
      setCurrentPatternWidthInTacts(patternWidthInTacts());
    }
  });

  const notes = createMemo(() =>
    props.pattern()?.type === "vst"
      ? ((props.pattern() as PatternVST)?.notes ?? [])
      : [],
  );

  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", handlePatternGlobalMouseMove);
    window.addEventListener("mouseup", handlePatternGlobalMouseUp);

    onCleanup(() => {
      window.removeEventListener("mousemove", handlePatternGlobalMouseMove);
      window.removeEventListener("mouseup", handlePatternGlobalMouseUp);
    });
  }

  const [isLoaded, setIsLoaded] = createSignal(false);

  createEffect(() => {
    if (props.pattern().type === "vst") {
      const inst = audioEngine.getInstrument(props.trackId);

      if (!inst) {
        setIsLoaded(false);
        return;
      }

      if (inst instanceof Tone.Sampler) {
        setIsLoaded(inst.loaded);
      } else {
        setIsLoaded(true);
      }
    } else if (props.pattern().type === "audio") {
      const player = audioEngine.getAudioPlayer(props.pattern().patternId);
      setIsLoaded(player?.buffer.loaded ?? false);
    }
  });

  return (
    <Show
      when={isLoaded()}
      fallback={
        <div
          class="pattern flex justify-center items-center"
          style={{
            left: `${patternPos()}px`,
            width: `${patternWidth()}px`,
            cursor: isGrabbing() ? "grabbing" : "pointer",
          }}
        >
          <span class="loading loading-spinner self-center  loading-sm"></span>
        </div>
      }
    >
      <div
        class="pattern h-full"
        data-pattern-id={props.pattern().patternId}
        style={{
          left: `${patternPos()}px`,
          width: `${patternWidth()}px`,
          cursor: isGrabbing() ? "grabbing" : "pointer",
        }}
        onMouseDown={startGrab}
        onContextMenu={(e: MouseEvent) => {
          e.preventDefault();
          handlePatternContextMenu(e, props.pattern());
        }}
        onDblClick={(e) => {
          if (props.pattern().type === "vst") {
            editPattern(e);
          }
        }}
      >
        <Show when={props.pattern().type === "vst"}>
          <div
            class="absolute top-0 w-2 left-0 z-1 h-full cursor-ew-resize rounded-sm bg-base-content/30 opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={startResizeLeft}
          />

          <div
            class="absolute top-0 w-2 right-0  z-1 h-full cursor-ew-resize rounded-sm bg-base-content/30 opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={startResizeRight}
          />
        </Show>

        <div class="w-full h-full bg-base-content/20">
          <Show when={props.pattern().type === "vst"}>
            <div
              class="grid absolute w-full h-full "
              style={{
                "grid-template-rows": `repeat(${ROWS_NUMBER}, minmax(0, 1fr))`,
              }}
            >
              <For each={notes()}>
                {(note) => {
                  const row = PIANOROLL_NOTES.indexOf(note.note);

                  return (
                    <div
                      class="absolute w-full "
                      style={{
                        top: `${(row / ROWS_NUMBER) * 100}%`,
                        height: `${100 / ROWS_NUMBER / 10 / 10}%`,
                      }}
                    >
                      <div
                        class="absolute h-1 bg-primary/54 light:bg-neutral/50"
                        style={{
                          left: `${(Math.max(note.pos - 1, 0) * patternWidth()) / patternWidthInTacts() / 4.04}px`,
                          width: `${(note.duration * patternWidth()) / 4.2 / patternWidthInTacts()}px`,
                        }}
                      />
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
          <Show when={props.pattern().type === "audio"}>
            <AudioPatternWaveform
              pattern={() => props.pattern() as PatternAudio}
            />
          </Show>
        </div>
      </div>
    </Show>
  );
};

export default Pattern;
