import { Component, onCleanup } from "solid-js";
import usePatternTransform from "../../../hooks/daw/pattern/usePatternTransform";
import { PatternType } from "../../../types/daw.types";
import { Accessor } from "solid-js";
import usePatternManage from "../../../hooks/daw/pattern/usePatternManage";

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
  } = usePatternTransform(props.pattern(), props.trackId);
  const { handlePatternContextMenu } = usePatternManage();
  


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
        cursor: isGrabbing() ? "grabbing" : "grab",
      }}
      onMouseDown={startGrab}
      onContextMenu={handlePatternContextMenu}
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
            {Array.from({ length: 2 }).map(() => (
              // <Note patternWidth={patternWidth} note={}/>
                <div class="w-2 h-1 bg-primary "/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pattern;
