import { Component, For, Show } from "solid-js";
import { generateColor } from "@/hooks/daw/vcs/useVcsModal";

interface VCSHistoryProps {
  versions: VersionMetadata[];
  selectedCommit: () => VersionMetadata | null;
  setSelectedCommit: (v: VersionMetadata | null) => void;
}

const VCSHistory: Component<VCSHistoryProps> = (props) => {
  return (
    <div class="flex-1 overflow-y-auto relative p-6 custom-scrollbar">
      <div class="absolute left-10 top-0 bottom-0 w-0.5 bg-neutral/10" />
      <div class="space-y-8 relative">
        <For each={props.versions}>
          {(version, i) => (
            <div
              onClick={() => props.setSelectedCommit(version)}
              class={`flex items-start gap-6 group cursor-pointer transition-all ${
                props.selectedCommit()?.id === version.id ? "translate-x-2" : ""
              }`}
            >
              <div class="relative z-10 mt-1.5">
                <div
                  class={`size-4 rounded-full border-4 border-base-100 shadow-sm transition-transform ${
                    props.selectedCommit()?.id === version.id ? "scale-125" : ""
                  }`}
                  style={{ "background-color": generateColor() }}
                />
                <Show when={i() < props.versions.length - 1}>
                  <div class="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-neutral/10" />
                </Show>
              </div>

              <div
                class={`flex-1 p-4 rounded-2xl border transition-all ${
                  props.selectedCommit()?.id === version.id
                    ? "bg-base-300 border-primary/40 shadow-md"
                    : "bg-base-300/60 border-transparent hover:bg-base-200"
                }`}
              >
                <div class="flex justify-between items-start mb-1">
                  <span class="text-sm font-bold tracking-tight">
                    {version.message}
                  </span>
                  <span class="text-[10px] font-mono opacity-30 uppercase">
                    {version.id.toUpperCase().slice(0, 5)}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-black uppercase text-primary/70">
                    {version.creatorUsername}
                  </span>
                  <span class="text-[10px] opacity-30 italic">
                    {version.createdAt
                      ? new Date(version.createdAt)
                          .toLocaleString()
                          .replace(/,/g, "\u00A0\u00A0")
                          .slice(0, -3)
                      : "Неизвестно"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default VCSHistory;