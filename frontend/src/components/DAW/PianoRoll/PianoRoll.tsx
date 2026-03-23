import { Component, createMemo, For, Index, Show } from "solid-js";
import { useTracksContext } from "../../../hooks/daw/context/useTracksContext";
import usePianoRoll from "../../../hooks/daw/pianoroll/usePianoRoll";
import useMainDawTrackPanel from "../../../hooks/daw/useTracksManagerPanel";
import { PatternVST } from "../../../types/daw.types";
import Note from "../Pattern/Note";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";

const OCTAVES_NUMBER = 7;

const PianoRoll: Component<{ onClose?: () => void }> = (props) => {
  const { handleOnWheelAndCtrlChangeTactsWidth } = useMainDawTrackPanel();
  const {
    addNote,
    PIANOROLL_NOTES,
    onPianoKeyPress,
    findPatternById,
    ROWS_NUMBER,
    resizePianoRollPanel,
  } = usePianoRoll();

  const { tactWidth, beatNumber } = useTracksContext();
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

  let pianoRef: HTMLDivElement | undefined;

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
        <div
          class="piano sticky left-0 z-30 shrink-0 bg-base-100"
          ref={pianoRef}
          onMouseDown={onPianoKeyPress}
        >
          <div
            data-note="C8"
            class="bg-amber-50 relative w-full h-6 border border-slate-950/10 shrink-0"
          >
            <div class="absolute right-1 -top-1 text-lg font-bold text-[#d6d2c2]">
              C8
            </div>
          </div>

          <Index each={Array.from({ length: OCTAVES_NUMBER })}>
            {(_, index) => (
              <div class="relative h-full" classList={{ "mt-72": index > 0 }}>
                <div class="whitekeys absolute left-0 top-0 w-full flex flex-col-reverse">
                  <div
                    data-note={`C${OCTAVES_NUMBER - index}`}
                    class="relative bg-amber-50 w-full h-9 border border-slate-950/10"
                  >
                    <div class="absolute right-1 top-0.5 text-lg font-bold text-[#d6d2c2]">
                      {`C${OCTAVES_NUMBER - index}`}
                    </div>
                  </div>
                  <div
                    data-note={`D${OCTAVES_NUMBER - index}`}
                    class="bg-amber-50 w-full h-12 border border-slate-950/10"
                  />
                  <div
                    data-note={`E${OCTAVES_NUMBER - index}`}
                    class="bg-amber-50 w-full h-9 border border-slate-950/10"
                  />
                  <div
                    data-note={`F${OCTAVES_NUMBER - index}`}
                    class="bg-amber-50 w-full h-9 border border-slate-950/10"
                  />
                  <div
                    data-note={`G${OCTAVES_NUMBER - index}`}
                    class="bg-amber-50 w-full h-12 border border-slate-950/10"
                  />
                  <div
                    data-note={`A${OCTAVES_NUMBER - index}`}
                    class="bg-amber-50 w-full h-12 border border-slate-950/10"
                  />
                  <div
                    data-note={`B${OCTAVES_NUMBER - index}`}
                    class="bg-amber-50 w-full h-9 border border-slate-950/10"
                  />
                </div>
                <div class="blackkeys flex flex-col absolute left-0 w-[50%] gap-7 mt-6">
                  <div class="gap-7 mt-0.5 flex flex-col">
                    <div
                      data-note={`A#${OCTAVES_NUMBER - index}`}
                      class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                    />
                    <div
                      data-note={`G#${OCTAVES_NUMBER - index}`}
                      class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                    />
                    <div
                      data-note={`F#${OCTAVES_NUMBER - index}`}
                      class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                    />
                  </div>
                  <div class="gap-7 mt-6 flex flex-col">
                    <div
                      data-note={`D#${OCTAVES_NUMBER - index}`}
                      class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                    />
                    <div
                      data-note={`C#${OCTAVES_NUMBER - index}`}
                      class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </Index>
          <div class="mt-72 relative h-full">
            <div
              data-note="B0"
              class="bg-amber-50 w-full h-9 border border-slate-950/10 shrink-0"
            />
            <div
              data-note="A0"
              class="bg-amber-50 w-full h-9 border border-slate-950/10 shrink-0"
            />
            <div
              data-note="A#0"
              class="bg-stone-800 absolute left-0 top-7 w-1/2 h-5 drop-shadow-xs drop-shadow-stone-800"
            />
          </div>
        </div>

        <div
          class="grid flex-1 min-w-0"
          onDblClick={(e) => addNote(e, pianoRef?.clientWidth!)}
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
                      <div class="border border-primary/5 border-dashed" />
                    )}
                  </Index>

                  <Show when={remainderBeat() > 0}>
                    <div
                      class="border border-primary/5 border-dashed"
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
