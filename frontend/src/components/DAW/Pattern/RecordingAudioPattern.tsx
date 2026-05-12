import { useTimelineContext } from "@/context/daw/timeline.context";
import { RecordPreviewPattern } from "@/types/daw.types";
import {
  Component,
  createSignal,
  onCleanup,
  For,
  createMemo,
  Accessor,
} from "solid-js";

const RecordingAudioPattern: Component<{
  recordPattern: Accessor<RecordPreviewPattern>;
}> = (props) => {
  const { tactWidth } = useTimelineContext();
  const [time, setTime] = createSignal(0);

  const timer = setInterval(() => setTime((t) => t + 1), 100);
  onCleanup(() => clearInterval(timer));

  const lineCount = 60;
  const containerWidth = 100;
  const lineWidth = containerWidth / lineCount;

  const seed = createMemo(() =>
    props
      .recordPattern()
      .trackId.split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0),
  );

  const patternPos = createMemo(() => props.recordPattern().pos * tactWidth());
  // const patternWidth = createMemo(() => props.recordPattern().width * tactWidth());

  return (
    <div
      class="absolute h-full flex items-center justify-center overflow-hidden border border-error/30 rounded-md z-20 pointer-events-none"
      style={{
        left: `${patternPos()}px`,
        width: `${tactWidth()}px`,
      }}
    >
      <div class="absolute inset-0 bg-error/5 animate-pulse" />

      <div class="w-full bg-error/10 h-full flex flex-col items-center justify-center relative z-10 px-1">
        <div class="text-error text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] mb-1 flex items-center gap-1.5">
          <span class="size-1.5 bg-error rounded-full animate-ping" />
          Запись...
        </div>

        <div class="flex items-center justify-center w-full h-10 min-h-10 gap-px">
          <For each={Array.from({ length: lineCount })}>
            {(_, i) => {
              const offset = time() * 0.2;
              const noise =
                Math.sin(i() * 0.5 + offset) * 15 +
                Math.cos(seed() + i() * 0.3 - offset) * 10 +
                Math.sin(seed() * i() * 0.1) * 5;

              const height = 35 + noise;
              const clampedHeight = Math.max(15, Math.min(85, height));

              return (
                <div
                  class="rounded-full bg-error/60 transition-all duration-75"
                  style={{
                    height: `${clampedHeight}%`,
                    width: `${lineWidth}%`,
                  }}
                />
              );
            }}
          </For>
        </div>

        <div class="mt-1 text-[8px] font-mono text-error/50">
          {(time() / 10).toFixed(1)} сек
        </div>
      </div>
    </div>
  );
};

export default RecordingAudioPattern;
