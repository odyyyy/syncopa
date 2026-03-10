import { onCleanup } from "solid-js";
import { useTracksContext } from "../../../hooks/daw/context/useTracksContext";
import usePatternTransform from "../../../hooks/daw/pattern/usePatternTransform";
import { PatternType } from "../../../types/daw.types";
import { Accessor } from "solid-js";


const Pattern = (props: { pattern: Accessor<PatternType>, trackId: string }) => {
  const {
    isGrabbing,
    patternPos,
    patternWidth,
    handleGlobalMouseMove,
    handleGlobalMouseUp,
    startResizeLeft,
    startResizeRight,
    startGrab,
  } = usePatternTransform(props.pattern(), props.trackId);

  const { tactWidth } = useTracksContext();

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
      class="pattern absolute"
      style={{
        left: `${patternPos()}px`,
        width: `${patternWidth()}px`,
        height: "100%",
        cursor: isGrabbing() ? "grabbing" : "grab",
      }}
      onMouseDown={startGrab}
    >
      <div
        class="absolute top-0 w-2 left-0 h-full cursor-ew-resize rounded-sm bg-base-content/30 opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={startResizeLeft}
      />

      <div
        class="absolute top-0 w-2 right-0 h-full cursor-ew-resize bg-base-content/30 opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={startResizeRight}
      />

      <div class="w-full h-full bg-base-content/20 rounded-sm flex items-center justify-center">
        <div class="grid grid-flow-rows grid-rows-10 w-full h-full">
          <div class="grid grid-flow-cols grid-cols-10 w-full h-full gap-1 place-items-center">
            {Array.from({ length: 10 }).map(() => (
              <div
                class="bg-primary/50 max-h-2 min-w-0.5 min-h-0.5"
                style={{
                  width: `${(patternWidth() * 3) / tactWidth()}px`,
                  height: `${(patternWidth() * 3) / tactWidth()}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pattern;
