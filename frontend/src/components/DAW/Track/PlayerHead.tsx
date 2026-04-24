import { Component } from "solid-js";
import useMainDawWorkspace from "../../../hooks/daw/useMainDawWorkspace";

const PlayerHead: Component = () => {
  const { finalPlayerHeadPos } = useMainDawWorkspace();

  return (
    <div
      class="absolute top-0 bottom-0 z-50 pointer-events-none"
      style={{
        left: `${finalPlayerHeadPos()}px`,
        "will-change": "left",
      }}
    >
      <div class="relative h-full w-[1.5px] bg-primary  shadow-[0_0_8px_rgba(var(--p),0.4)]">
        <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-4">
          <div
            class="w-full h-full bg-primary"
            style={{
              "clip-path":
                "polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)",
            }}
          />
          <div class="absolute top-0 left-0 w-full h-0.5 bg-white/40 rounded-full" />
        </div>
        <div class="absolute inset-0 bg-linear-to-b from-primary via-primary/20 to-transparent opacity-40" />
      </div>
    </div>
  );
};

export default PlayerHead;
