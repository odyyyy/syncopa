import { Component, createSignal, For, Index } from "solid-js";

const TracksManagePanel: Component = () => {
  const c = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [width, setWidth] = createSignal(180);
  const [tactElementsNumber, setTactElementsNumber] = createSignal(30);

  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      setWidth((prev) => Math.min(prev + 20, 400));
    } else {
      setWidth((prev) => Math.max(prev - 20, 80));
    }
  };

  return (
    <div class="grid grid-cols-[1fr_4fr] w-full flex-1  min-h-0 overflow-y-hidden overflow-x-hidden">
      <div class="bg-base-200 h-full min-w-70">
        <button class="btn-main bg-base-300 text-base hover:bg-base-100 w-full h-10">
          Добавить дорожку
        </button>
      </div>

      <div
        class="bg-base-200 h-full grid grid-flow-col  justify-start overflow-x-auto overflow-y-hidden"
        onWheel={handleWheel}
      >
        <Index each={Array.from({ length: tactElementsNumber() })}>
          {(_, index) => (
            <div
              class="bg-base-200/90 grid grid-rows-[0.5fr_20fr]"
              style={{ width: `${width()}px` }}
            >
              <div class="w-full h-10 bg-base-200 max-h-10 text-center border-r border-r-base-content/20">
                {index + 1}
              </div>
              <div class="tact">
                <div class="tact-el"></div>
                <div class="tact-el"></div>
                <div class="tact-el"></div>
                <div class="tact-el"></div>
              </div>
            </div>
          )}
        </Index>
      </div>
    </div>
  );
};

export default TracksManagePanel;
