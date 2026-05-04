import { VCSStateType, VersionMetadata } from "@/types/vcs.types";
import { Component, Show } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

interface VCSInspectorProps {
  selectedVersion: () => VersionMetadata | null;
  setSelectedVersion: (v: VersionMetadata | null) => void;
  setVCSState: SetStoreFunction<VCSStateType>;
  loadSelectedVersion: () => Promise<void>;
  setVcsLoading: (loading: boolean) => void;
  openSwitchModal: (callback: () => void | Promise<void>) => void;
}

const VCSInspector: Component<VCSInspectorProps> = (props) => {
  return (
    <div
      class={`w-72 bg-base-200 border-l border-base-content/5 flex flex-col transition-all duration-300 ${
        props.selectedVersion()
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 absolute right-0"
      }`}
    >
      <Show when={props.selectedVersion()}>
        <div class="p-6 flex flex-col h-full">
          <div class="mb-6">
            <label class="text-[9px] font-black uppercase opacity-30 block mb-2 tracking-widest">
              Инспектор версии
            </label>
            <h4 class="text-[11px] font-black  font-mono uppercase text-primary/50 mb-1">
              {props.selectedVersion()?.id.toUpperCase().slice(0, 5)}
            </h4>
            <p class="text-lg font-bold opacity-90 leading-relaxed">
              {props.selectedVersion()?.message ||
                "Нет детального описания для этой версии."}
            </p>
          </div>

          <div class="space-y-2 mt-auto">
            <button
              onClick={() => {
                props.openSwitchModal(props.loadSelectedVersion);
              }}
              class="btn btn-neutral btn-block btn-sm rounded-xl text-[10px] font-black uppercase"
            >
              Перейти к версии
            </button>
            <button class="btn btn-primary btn-block btn-sm rounded-xl text-[10px] font-black uppercase">
              Откатиться к версии
            </button>
            <button
              onClick={() => props.setSelectedVersion(null)}
              class="btn btn-ghost btn-block btn-xs text-[9px] font-bold uppercase opacity-30 hover:opacity-80 mt-4"
            >
              Закрыть панель
            </button>
          </div>
        </div>
      </Show>

      
    </div>
  );
};

export default VCSInspector;
