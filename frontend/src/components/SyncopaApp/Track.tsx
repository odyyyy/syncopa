import { Component, Index } from "solid-js";

type TrackProps = {
  tactElementsNumber: number;
};

const Track: Component<TrackProps> = (props) => {
  return (
    <div class="bg-base-200/90 grid grid-flow-col w-full">
      <Index each={Array.from({ length: props.tactElementsNumber })}>
        {(_, index) => (
          <div class="tact ">
            <div class="tact-el"></div>
            <div class="tact-el"></div>
            <div class="tact-el"></div>
            <div class="tact-el"></div>
          </div>
        )}
      </Index>
    </div>
  );
};
export default Track;