import { Component, onCleanup } from "solid-js";

interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  unit?: string;
}

export const AudioKnob: Component<KnobProps> = (props) => {
  let rafId: number;
  const size = 60;
  const radius = 24;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const getAngle = () =>
    ((props.value - props.min) / (props.max - props.min)) * 360;

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startValue = props.value;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const deltaY = startY - moveEvent.clientY;
        const range = props.max - props.min;

        const sensitivity = 0.0025;

        let newValue = startValue + deltaY * range * sensitivity;
        newValue = Math.max(props.min, Math.min(props.max, newValue));
        props.onChange(Number(newValue.toFixed(2)));
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "ns-resize";
  };

  onCleanup(() => cancelAnimationFrame(rafId));

  return (
    <div class="flex flex-col items-center group select-none">
      <div class="relative cursor-ns-resize" onMouseDown={handleMouseDown}>
        <svg width={size} height={size} class="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            class="text-neutral opacity-20"
            stroke-width="3"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            class="text-primary transition-all duration-75"
            stroke-width="3"
            stroke-dasharray={`${circumference}`}
            style={{
              "stroke-dashoffset":
                circumference -
                (circumference * (props.value - props.min)) /
                  (props.max - props.min),
            }}
            stroke-linecap="round"
          />
        </svg>

        <div
          class="absolute inset-2.5 bg-base-300 rounded-full shadow-lg border border-white/5 flex items-center justify-center"
          style={{ transform: `rotate(${getAngle()}deg)` }}
        >
          <div class="absolute top-1 w-1 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--p),1)]" />
          <div class="w-6 h-6 rounded-full bg-base-200/50" />
        </div>
      </div>

      <span class="text-[12px] font-black uppercase tracking-widest mt-2 opacity-30">
        {props.label}
      </span>
      <span class="text-[12px] font-mono font-bold text-primary/76 mt-0.5">
        {props.value}
        {props.unit}
      </span>
    </div>
  );
};
