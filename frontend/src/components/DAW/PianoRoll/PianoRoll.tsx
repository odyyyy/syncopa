import { Component, createMemo, For, Index, Show } from "solid-js";
import { useTimelineContext } from "@/context/daw/timeline.context";
import usePianoRoll from "../../../hooks/daw/pianoroll/usePianoRoll";
import useMainDawWorkspace from "../../../hooks/daw/useMainDawWorkspace";
import { PatternVST } from "../../../types/daw.types";
import Note from "../Pattern/Note";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import Piano from "./Piano";

const PianoRoll: Component = () => {
  let pianoRef: HTMLDivElement | undefined;
  
  const { handleOnWheelAndCtrlChangeTactsWidth } = useMainDawWorkspace();
  const {
    addNoteInPianoRoll,
    PIANOROLL_NOTES,
    onPianoKeyPress,
    findPatternById,
    ROWS_NUMBER,
    resizePianoRollPanel,
  } = usePianoRoll();

  const { tactWidth, beatNumber } = useTimelineContext();
  const { currentPatternWidthInTacts, setIsPianoRollOpen } =
    usePianoRollContext();

  const totalBeats = createMemo(
    () => currentPatternWidthInTacts() * beatNumber(),
  );
  const fullBeats = createMemo(() => Math.floor(totalBeats()));
  const remainderBeat = createMemo(() => totalBeats() - fullBeats());
  const pattern = createMemo(() => findPatternById());
  const notes = createMemo(() =>
    pattern()?.type === "vst" ? ((pattern() as PatternVST)?.notes ?? []) : [],
  );


  return (
    <div class="relative flex flex-col w-full h-full bg-base-100/32 overflow-hidden border-t border-base-content/10">
      <div
        class="sticky top-0 left-0 z-50 w-full h-1.5 bg-base-content/10 hover:bg-primary/50 transition-colors cursor-s-resize shrink-0"
        onMouseDown={resizePianoRollPanel}
      />

      <button
        onClick={() => setIsPianoRollOpen(false)}
        class="absolute top-4 right-4 z-60 btn btn-circle btn-xs btn-ghost bg-base-200/50 hover:bg-error hover:text-error-content"
      >
        ✕
      </button>

      <div
        class="flex w-full overflow-auto"
        onWheel={handleOnWheelAndCtrlChangeTactsWidth}
      >
        <Piano ref={pianoRef} onPianoKeyPress={onPianoKeyPress} />

        <div
          class="grid flex-1 min-w-0"
          onDblClick={(e) => addNoteInPianoRoll(e, pianoRef?.clientWidth!)}
        >
          <div class="flex flex-col">
            <Index each={Array.from({ length: ROWS_NUMBER })}>
              {(_, rowIndex) => (
                <div
                  class="grid h-6 relative"
                  data-note={PIANOROLL_NOTES[rowIndex]}
                  classList={{
                    "bg-base-200/50": [2, 4, 6, 9, 11].includes(rowIndex % 12),
                  }}
                  style={{
                    "grid-template-columns": `repeat(${fullBeats()}, 1fr) ${remainderBeat() > 0 ? `${remainderBeat()}fr` : ""}`,
                    width: `${((tactWidth() * 3) / beatNumber()) * totalBeats()}px`,
                  }}
                >
                  <Index each={Array.from({ length: fullBeats() })}>
                    {() => (
                      <div class="border border-primary/5 light:border-neutral/7 border-dashed" />
                    )}
                  </Index>

                  <Show when={remainderBeat() > 0}>
                    <div
                      class="border border-primary/5 light:border-neutral/6 border-dashed"
                      style={{
                        flex: "0 0 auto",
                        width: `${((tactWidth() * 3) / beatNumber()) * remainderBeat()}px`,
                      }}
                    />
                  </Show>

                  <For each={notes()}>
                    {(note) => (
                      <Show when={note.note === PIANOROLL_NOTES[rowIndex]}>
                        <Note patternWidthInBeats={totalBeats} note={note} />
                      </Show>
                    )}
                  </For>
                </div>
              )}
            </Index>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PianoRoll;
