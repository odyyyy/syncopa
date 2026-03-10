import { Accessor, Component,  Index, Show } from "solid-js";
import Pattern from "../Pattern/Pattern";
import { PatternType } from "../../../types/daw.types";

type TrackProps = {
  trackId: string;
  patterns: PatternType[];
  tactElementsNumber: number;
};

export const Track: Component<TrackProps> = (props) => {
  return (
    <div  data-track-id={`${props.trackId}`} class="track">
      <Index each={Array.from({ length: props.tactElementsNumber })}>
        {(_, index) => (
          <div class="tact">
            <div class="tact-el"></div>
            <div class="tact-el"></div>
            <div class="tact-el"></div>
            <div class="tact-el"></div>
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
