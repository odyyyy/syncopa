import { Component, Index } from "solid-js";

const Piano: Component<{ onPianoKeyPress?: (e: MouseEvent) => void }> = (props) => {
  
  const OCTAVES_NUMBER = 7;
  
  return (
    <div
      class="piano sticky left-0 z-30 shrink-0 bg-base-100"
      onMouseDown={props.onPianoKeyPress}
    >
      <div data-note="C8" class=" h-6 whitekey">
        <div class="absolute right-1 -top-1 text-lg font-bold text-[#d6d2c2] ">
          C8
        </div>
      </div>

      <Index each={Array.from({ length: OCTAVES_NUMBER })}>
        {(_, index) => (
          <div class="relative h-full" classList={{ "mt-72": index > 0 }}>
            <div class="whitekeys absolute left-0 top-0 w-full flex flex-col-reverse">
              <div
                data-note={`C${OCTAVES_NUMBER - index}`}
                class="relative  h-9 whitekey"
              >
                <div class="absolute right-1 top-0.5 text-lg font-bold text-[#d6d2c2]">
                  {`C${OCTAVES_NUMBER - index}`}
                </div>
              </div>
              <div
                data-note={`D${OCTAVES_NUMBER - index}`}
                class="h-12 whitekey"
              />
              <div
                data-note={`E${OCTAVES_NUMBER - index}`}
                class="h-9 whitekey"
              />
              <div
                data-note={`F${OCTAVES_NUMBER - index}`}
                class="h-9 whitekey"
              />
              <div
                data-note={`G${OCTAVES_NUMBER - index}`}
                class="h-12 whitekey"
              />
              <div
                data-note={`A${OCTAVES_NUMBER - index}`}
                class="h-12 whitekey"
              />
              <div
                data-note={`B${OCTAVES_NUMBER - index}`}
                class="h-9 whitekey"
              />
            </div>
            <div class="blackkeys flex flex-col absolute left-0 w-[50%] gap-7 mt-6">
              <div class="gap-7 mt-0.5 flex flex-col">
                <div
                  data-note={`A#${OCTAVES_NUMBER - index}`}
                  class="blackkey"
                />
                <div
                  data-note={`G#${OCTAVES_NUMBER - index}`}
                  class="blackkey"
                />
                <div
                  data-note={`F#${OCTAVES_NUMBER - index}`}
                  class="blackkey"
                />
              </div>
              <div class="gap-7 mt-6 flex flex-col">
                <div
                  data-note={`D#${OCTAVES_NUMBER - index}`}
                  class="blackkey"
                />
                <div
                  data-note={`C#${OCTAVES_NUMBER - index}`}
                  class="blackkey"
                />
              </div>
            </div>
          </div>
        )}
      </Index>
      <div class="mt-72 relative h-full">
        <div data-note="B0" class=" h-9 whitekey shrink-0" />
        <div data-note="A0" class=" h-9 whitekey shrink-0" />
        <div
          data-note="A#0"
          class="blackkey absolute left-0 top-7 w-1/2 "
        />
      </div>
    </div>
  );
};
export default Piano;
