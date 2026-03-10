import { Component, createSignal, Index, Show } from "solid-js";
import Pattern from "../Pattern/Pattern";

type TrackProps = {
  trackId: number;
  tactElementsNumber: number;
};

export const Track: Component<TrackProps> = (props) => {
  return (
    <div class="bg-base-200/90 grid grid-flow-col w-full relative">
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

      <Show when={props.trackId === 1}>
        <Pattern />
      </Show>
    </div>
  );
};
