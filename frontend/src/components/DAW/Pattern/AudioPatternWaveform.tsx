import { PatternAudio } from "@/types/daw.types";
import { Component } from "solid-js";

const AudioPatternWaveform: Component<{ pattern: () => PatternAudio }> = (
  props,
) => {
  return (
    <div class="w-full h-full flex items-center justify-center">
      <div class="w-full bg-neutral/25 h-full light:bg-base-content/5 flex flex-col items-center justify-center ">
        <div class="light:text-neutral/60 text-base-content/60 text-[10px] font-bold uppercase tracking-wider mb-3 truncate pointer-events-none">
          {props.pattern().title.replace(/\.(mp3|wav|ogg|flac|m4a)$/, "") ||
            "Аудиофайл"}
        </div>
        <div class="flex items-center justify-center w-full  h-12 min-h-12">
          {(() => {
            const seed = props
              .pattern()
              .patternId.split("")
              .reduce((acc, char) => acc + char.charCodeAt(0), 0);

            const lineCount = 60;
            const containerWidth = 100; 
            const lineWidth = containerWidth / lineCount;

            return Array.from({ length: lineCount }).map((_, i) => {
              const noise = Math.sin(i * 0.5) * 12 + Math.cos(seed + i * 0.3) * 10 + Math.sin(seed * i * 0.1) * 8;
              const height = 40 + noise;
              const clampedHeight = Math.max(20, Math.min(70, height));

              return (
                <div
                  class="rounded-full light:bg-neutral/50 transition-all duration-150 bg-base-content/50"
                  style={{
                    height: `${clampedHeight}%`,
                    width: `${lineWidth}%`,
                  }}
                />
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};

export default AudioPatternWaveform;
