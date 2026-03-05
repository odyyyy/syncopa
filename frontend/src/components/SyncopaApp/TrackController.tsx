import { Component } from "solid-js";

interface TrackControllerProps {
  track: {
    id: number;
    name: string;
    elements: any[];
  };
}

const TrackController: Component<TrackControllerProps> = ({ track }) => {
  return (
    <div class="flex flex-col h-25 max-h-30 w-full bg-base-100/22  justify-between p-2 border-b border-b-base-300">
      <div class="flex justify-start ">
        <div class="flex items-center gap-2 justify-center stroke-black stroke-2 fill-current ">
          <svg
            viewBox="0 0 48 48"
            class="h-6 w-6 stroke-base-content"
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 48 48"
          >
            <circle cx="19" cy="33" r="9" />
            <polygon points="24,6 24,33 28,33 28,14 39,17 39,10" />
          </svg>

          <input
            class="text-base w-fit selection:bg-base-content/15 cursor-pointer focus-visible:border-none outline-none  border-none user-select-none"
            type="text"
            value={track.name}
            onChange={(e) => track.name = e.target.value}
          />
        </div>
      </div>
      <div class="flex-row flex justify-between ">
        <div class="volume ">
          <input
            type="range"
            min="0"
            max="100"
            value="50"
            class="range range-xs max-w-50 w-50 max-h-4"
          />
        </div>
        <div class="flex-row flex gap-2 mr-1">
          <div class="tooltip tooltip-bottom" data-tip="Заглушить">
            <div class="mute btn-main p-1 rounded-full w-8">M</div>
          </div>
          <div class="tooltip tooltip-bottom" data-tip="Только эту дорожку">
            <div class="solo btn-main p-1 rounded-full w-8">S</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackController;
