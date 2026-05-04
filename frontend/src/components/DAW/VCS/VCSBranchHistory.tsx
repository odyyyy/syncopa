import { Component, For, Show } from "solid-js";
import { generateColor } from "@/hooks/daw/vcs/useVcsModal";
import { VersionMetadata } from "@/types/vcs.types";

interface VCSBranchHistoryProps {
  versions: VersionMetadata[];
  selectedVersion: () => VersionMetadata | null;
  setSelectedVersion: (v: VersionMetadata | null) => void;
}

const VCSBranchHistory: Component<VCSBranchHistoryProps> = (props) => {
  return (
    <div class="flex-1 overflow-y-auto relative p-6 custom-scrollbar">
      <div class="absolute left-10 top-0 bottom-0 w-0.5 bg-neutral/10" />
      <div class="space-y-8 relative">
        <For each={props.versions}>
          {(version, i) => (
            <div
              onClick={() => props.setSelectedVersion(version)}
              class={`flex items-start gap-6 group cursor-pointer transition-all ${
                props.selectedVersion()?.id === version.id ? "translate-x-2" : ""
              }`}
            >
              <div class="relative z-10 mt-1.5">
                <div
                  class={`size-4 rounded-full border-4 border-base-100 shadow-sm transition-transform ${
                    props.selectedVersion()?.id === version.id ? "scale-125" : ""
                  } ${
                    version.isHead
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                      : ""
                  }`}
                  style={{ "background-color": generateColor() }}
                />

                <Show when={version.isHead}>
                  <div class="absolute -inset-1 bg-primary/20 rounded-full animate-ping -z-10" />
                </Show>

                <Show when={i() < props.versions.length - 1}>
                  <div class="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-neutral/10" />
                </Show>
              </div>

              <div
                class={`flex-1 p-4 rounded-2xl border transition-all ${
                  version.isHead && props.selectedVersion()?.id !== version.id
                    ? "bg-base-300/80 border-primary/20"
                    : props.selectedVersion()?.id === version.id
                      ? "bg-base-300 border-primary/40 shadow-md"
                      : "bg-base-300/60 border-transparent hover:bg-base-200"
                }`}
              >
                <div class="flex justify-between items-start mb-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold tracking-tight">
                      {version.message}
                    </span>
                    <Show when={version.isHead}>
                      <span class="badge badge-primary badge-xs font-black text-[8px] px-1.5 h-4">
                        HEAD
                      </span>
                    </Show>
                  </div>
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

export default VCSBranchHistory;
