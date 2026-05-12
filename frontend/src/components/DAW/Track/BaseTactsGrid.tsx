import { useTimelineContext } from "@/context/daw/timeline.context";
import { Component, Index } from "solid-js";


type BaseTactsGridProps = {
  width: () => number;
};
const BaseTactsGrid: Component<BaseTactsGridProps> = (props) => {
  const { tactElementsNumber } = useTimelineContext();
  return (
    <div class="bg-base-200/90 grid grid-flow-col w-full">
      <Index each={Array.from({ length: tactElementsNumber() })}>
        {(_, index) => (
          <div
            style={{ width: `${props.width()}px` }}
            class="w-full h-10 bg-base-200 text-base-content/70 max-h-10 text-center place-content-center border-r border-r-base-100"
          >
            {index + 1}
          </div>
        )}
      </Index>
    </div>
  );
};
export default BaseTactsGrid;