import {
  Accessor,
  Component,
  createMemo,
  For,
  Index,
  onMount,
  Show,
} from "solid-js";
import { useTracksContext } from "../../../hooks/daw/context/useTracksContext";
import usePianoRoll from "../../../hooks/daw/usePianoRoll";
import useMainDawTrackPanel from "../../../hooks/daw/useTracksManagerPanel";
import { PatternVST } from "../../../types/daw.types";
import Note from "../Pattern/Note";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";

const OCTAVES_NUMBER = 7;

const PianoRoll: Component = () => {
  const { handleOnWheelAndCtrlChangeTactsWidth } = useMainDawTrackPanel();
  const {
    addNote,
    PIANOROLL_NOTES,
    onPianoKeyPress,
    findPatternById,
    ROWS_NUMBER,
  } = usePianoRoll();

  const { tactWidth, beatNumber } = useTracksContext();
  const { currentPatternWidthInTacts } = usePianoRollContext();

  const notes_per_row = createMemo(
    () => currentPatternWidthInTacts() * beatNumber(),
  );
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
  let pianoRollRef: HTMLDivElement | undefined;

  onMount(() => {
    if (pianoRollRef) {
      const { offsetHeight } = pianoRollRef;
      const middlePosition = offsetHeight / 2;

      window.scrollTo({
        top: middlePosition,
        behavior: "smooth",
      });
    }
  });

  return (
    <div
      class="flex w-full h-full overflow-auto bg-base-100/32"
      ref={pianoRollRef}
      onWheel={handleOnWheelAndCtrlChangeTactsWidth}
    >
      <div class="piano" ref={pianoRef} onMouseDown={onPianoKeyPress}>
        <div
          data-note="C8"
          class=" bg-amber-50  w-full h-6 border border-slate-950/10 shrink-0"
        ></div>

        <Index each={Array.from({ length: OCTAVES_NUMBER })}>
          {(_, index) => (
            <div class="relative h-full" classList={{ "mt-72": index > 0 }}>
              <div class="whitekeys absolute left-0 top-0 w-full flex flex-col-reverse">
                <div
                  data-note={`C${OCTAVES_NUMBER - index}`}
                  class="bg-amber-50 w-full h-9 border border-slate-950/10"
                />
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
                  ></div>
                  <div
                    data-note={`G#${OCTAVES_NUMBER - index}`}
                    class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                  ></div>
                  <div
                    data-note={`F#${OCTAVES_NUMBER - index}`}
                    class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                  ></div>
                </div>
                <div class="gap-7 mt-6 flex flex-col">
                  <div
                    data-note={`D#${OCTAVES_NUMBER - index}`}
                    class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                  ></div>
                  <div
                    data-note={`C#${OCTAVES_NUMBER - index}`}
                    class="bg-stone-800 h-5 drop-shadow-xs drop-shadow-stone-800"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </Index>
        <div class="mt-72 relative h-full">
          <div
            data-note="B0"
            class="bg-amber-50 w-full h-9 border border-slate-950/10 shrink-0"
          ></div>
          <div
            data-note="A0"
            class="bg-amber-50 w-full h-9 border border-slate-950/10 shrink-0"
          ></div>
          <div
            data-note="A#0"
            class="bg-stone-800 absolute left-0 top-7 w h-5 drop-shadow-xs drop-shadow-stone-800 w-[50%]"
          ></div>
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
                  "grid-template-columns": `
                          repeat(${fullBeats()}, 1fr)
                          ${remainderBeat() > 0 ? `${remainderBeat()}fr` : ""}
                        `,
                  width: `${
                    ((tactWidth() * 3) / beatNumber()) * totalBeats()
                  }px`,
                }}
              >
                <Index each={Array.from({ length: fullBeats() })}>
                  {() => <div class="border border-primary/5 border-dashed" />}
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
  );
};

export default PianoRoll;
