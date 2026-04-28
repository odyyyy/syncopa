import { PatternAudio } from "@/types/daw.types";
import { Component } from "solid-js";

const AudioPatternWaveform: Component<{ pattern: () => PatternAudio }> = (
  props,
) => {
  return (
    <div class="w-full h-full flex items-center justify-center">
      <div class="w-full bg-neutral/25 h-full light:bg-base-content/5 flex flex-col items-center justify-center ">
        <div class="light:text-neutral/60 text-base-content/60 text-[10px] font-bold uppercase tracking-wider mb-3 truncate pointer-events-none">
          {props.pattern().title || "Аудиофайл"}
        </div>
        <div class="flex items-center justify-center gap-0.5 w-full px-0.5 h-12">
          {(() => {
            const seed = props
              .pattern()
              .patternId.split("")
              .reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const heights = [];
            for (let i = 0; i < 100; i++) {
              const noise =
                Math.sin(i * 0.5) * 8 +
                Math.cos(seed + i * 0.3) * 6 +
                Math.sin(seed * i * 0.1) * 4;
              const height = 24 + noise;
              heights.push(Math.max(8, Math.min(40, height)));
            }
            return heights.map((height, i) => (
              <div
                class="bg-base-content/50 light:bg-neutral/60 rounded-full flex-1 transition-all duration-150"
                style={{ height: `${height}px` }}
              />
            ));
          })()}
        </div>
      </div>
    </div>
  );
};

export default AudioPatternWaveform;
