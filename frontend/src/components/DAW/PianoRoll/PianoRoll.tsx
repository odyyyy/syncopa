import { Component, createMemo, For, Index, Show } from "solid-js";
import { useTimelineContext } from "@/context/daw/timeline.context";
import usePianoRoll from "../../../hooks/daw/pianoroll/usePianoRoll";
import useMainDawWorkspace from "../../../hooks/daw/useMainDawWorkspace";
import { PatternVST } from "../../../types/daw.types";
import Note from "../Pattern/Note";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import Piano from "./Piano";

const SUBDIV = 4;
const ZOOM_THRESHOLD = 180;

const PianoRoll: Component = () => {
  let pianoRef!: HTMLDivElement;
  let scrollRef!: HTMLDivElement;

  const { handleOnWheelAndCtrlChangeTactsWidth } = useMainDawWorkspace();
  const {
    addNoteInPianoRoll,
    PIANOROLL_NOTES,
    onPianoKeyPress,
    findPatternById,
    ROWS_NUMBER,
    resizePianoRollPanel,
    handleNoteContextMenu,
  } = usePianoRoll();

  const { tactWidth, beatNumber } = useTimelineContext();
  const { currentPatternWidthInTacts, setIsPianoRollOpen } =
    usePianoRollContext();

  const totalBeats = createMemo(
    () => currentPatternWidthInTacts() * beatNumber(),
  );
  const fullBeats = createMemo(() => Math.floor(totalBeats()));
  const remainderBeat = createMemo(() => totalBeats() - fullBeats());
  const beatPx = createMemo(() => (tactWidth() * 3) / beatNumber());
  const isZoomedIn = createMemo(() => beatPx() >= ZOOM_THRESHOLD);
  const subdivForMode = createMemo(() => (isZoomedIn() ? SUBDIV : 1));
  const totalSteps = createMemo(() =>
    Math.floor(totalBeats() * subdivForMode()),
  );
  const pattern = createMemo(() => findPatternById());
  const notes = createMemo(() =>
    pattern()?.type === "vst" ? ((pattern() as PatternVST)?.notes ?? []) : [],
  );
  const isBeatLine = (i: number) => i % subdivForMode() === 0;

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
        ref={(el) => (scrollRef = el)}
        class="flex w-full overflow-auto"
        onWheel={handleOnWheelAndCtrlChangeTactsWidth}
      >
        <Piano
          ref={(el) => (pianoRef = el)}
          onPianoKeyPress={onPianoKeyPress}
        />

        <div
          class="grid flex-1 min-w-0"
          onDblClick={(e) => addNoteInPianoRoll(e, scrollRef?.scrollLeft ?? 0)}
          onContextMenu={handleNoteContextMenu}
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
                  style={
                    isZoomedIn()
                      ? {
                          "grid-template-columns": `repeat(${totalSteps()}, 1fr)`,
                          width: `${beatPx() * totalBeats()}px`,
                        }
                      : {
                          "grid-template-columns": `repeat(${fullBeats()}, 1fr) ${remainderBeat() > 0 ? `${remainderBeat()}fr` : ""}`,
                          width: `${beatPx() * totalBeats()}px`,
                        }
                  }
                >
                  <Show when={isZoomedIn()}>
                    <Index each={Array.from({ length: totalSteps() })}>
                      {(_, i) => (
                        <div
                          class="relative border-dashed border-primary/5"
                          classList={{
                            "border-l border-l-primary/25 border-b border-b-primary/5":
                              isBeatLine(i),
                            "border-l border-l-primary/8 border-b border-b-primary/5":
                              !isBeatLine(i),
                          }}
                        >
                          <Show when={isBeatLine(i)}>
                            <span class="absolute -top-3 left-0.5 text-[9px] text-base-content/35 select-none pointer-events-none">
                              {Math.floor(i / SUBDIV) + 1}
                            </span>
                          </Show>
                        </div>
                      )}
                    </Index>
                  </Show>

                  <Show when={!isZoomedIn()}>
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
                          width: `${beatPx() * remainderBeat()}px`,
                        }}
                      />
                    </Show>
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
