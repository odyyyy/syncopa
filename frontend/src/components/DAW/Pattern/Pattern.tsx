import { Component, createEffect, createMemo, For, onCleanup } from "solid-js";
import usePatternTransform from "../../../hooks/daw/pattern/usePatternTransform";
import { PatternType, PatternVST } from "../../../types/daw.types";
import { Accessor } from "solid-js";
import usePatternManage from "../../../hooks/daw/pattern/usePatternManage";
import usePianoRoll from "../../../hooks/daw/pianoroll/usePianoRoll";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";

const Pattern: Component<{
  pattern: Accessor<PatternType>;
  trackId: string;
}> = (props) => {
  const {
    isGrabbing,
    patternPos,
    patternWidth,
    handleGlobalMouseMove,
    handleGlobalMouseUp,
    startResizeLeft,
    startResizeRight,
    startGrab,
    patternWidthInTacts,
  } = usePatternTransform(props.pattern, props.trackId);
  const { handlePatternContextMenu, editPattern } =
    usePatternManage(patternWidthInTacts);
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
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    onCleanup(() => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    });
  }

  return (
    <div
      class="pattern h-full"
      data-pattern-id={props.pattern().patternId}
      style={{
        left: `${patternPos()}px`,
        width: `${patternWidth()}px`,
        cursor: isGrabbing() ? "grabbing" : "pointer",
      }}
      onMouseDown={startGrab}
      onContextMenu={handlePatternContextMenu}
      ondblclick={editPattern}
    >
      <div
        class="absolute top-0 w-2 left-0 z-1 h-full cursor-ew-resize rounded-sm bg-base-content/30 opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={startResizeLeft}
      />

      <div
        class="absolute top-0 w-2 right-0  z-1 h-full cursor-ew-resize rounded-sm bg-base-content/30 opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={startResizeRight}
      />

      <div class="w-full h-full bg-base-content/20">
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
                    class="absolute h-1 bg-primary/54"
                    style={{
                      left: `${(Math.max(note.pos - 1, 0) * patternWidth()) / patternWidthInTacts() / 4}px`,
                      width: `${(note.duration * patternWidth()) / 4.2 / patternWidthInTacts()}px`,
                    }}
                  />
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default Pattern;
