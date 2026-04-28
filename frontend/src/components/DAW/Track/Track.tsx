import { Accessor, Component, Index, Show } from "solid-js";
import Pattern from "../Pattern/Pattern";
import { PatternType } from "../../../types/daw.types";
import { useTimelineContext } from "@/context/daw/timeline.context";

type TrackProps = {
  trackId: string;
  patterns: PatternType[];
  onClick?: () => void;
  tactElementsNumber: number;
};

export const Track: Component<TrackProps> = (props) => {
  const { beatNumber } = useTimelineContext();
  return (
    <div
      data-track-id={`${props.trackId}`}
      class="track"
      onClick={() => props.onClick?.()}
    >
      <Index each={Array.from({ length: props.tactElementsNumber })}>
        {(_, index) => (
          <div class="tact">
            <Index each={Array.from({ length: beatNumber() })}>
              {(_, index) => <div class="tact-el"></div>}
            </Index>
          </div>
        )}
      </Index>

      <Index each={props.patterns}>
        {(pattern: Accessor<PatternType>) => (
          <Pattern pattern={pattern} trackId={props.trackId} />
        )}
      </Index>
    </div>
  );
};
