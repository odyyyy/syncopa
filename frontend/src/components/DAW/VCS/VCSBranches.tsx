import { Component, For, Show } from "solid-js";

interface VCSBranchesProps {
  branches: string[];
  currentBranch: () => string;
  setCurrentBranch: (name: string) => void;
  isCreating: () => boolean;
  setIsCreating: (v: boolean) => void;
  newName: () => string;
  setNewName: (v: string) => void;
  onCreate: () => void;
}

const VCSBranches: Component<VCSBranchesProps> = (props) => {
  return (
    <div class="w-56 bg-base-200 border-r border-base-content/5 p-4 flex flex-col gap-4">
      <div>
        <label class="text-[9px] font-black uppercase opacity-30 mb-2 block ml-2 tracking-widest">
          Ветки
        </label>
        <div class="space-y-1">
          <For each={props.branches}>
            {(branch) => (
              <button
                onClick={() => props.setCurrentBranch(branch)}
                class={`w-full text-left px-3 py-2 cursor-pointer rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  props.currentBranch() === branch
                    ? "bg-primary text-primary-content shadow-lg"
                    : "hover:bg-base-300 opacity-60"
                }`}
              >
                {branch}
                <Show when={props.currentBranch() === branch}>
                  <div class="size-1.5 bg-current rounded-full animate-pulse" />
                </Show>
              </button>
            )}
          </For>
          <Show
            when={props.isCreating()}
            fallback={
              <button
                onClick={() => props.setIsCreating(true)}
                class="w-full mt-2 cursor-pointer border border-dashed border-base-content/20 py-2 rounded-lg text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-all"
              >
                + Новая ветка
              </button>
            }
          >
            <div class="mt-2 p-2 bg-base-300 rounded-lg border border-primary/20 animate-in fade-in zoom-in duration-200">
              <input
                autofocus
                type="text"
                placeholder="Название ветки..."
                value={props.newName()}
                onInput={(e) => props.setNewName(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && props.onCreate()}
                class="w-full bg-base-100 border-none outline-none rounded px-2 py-1.5 text-xs font-bold mb-2 focus:ring-1 ring-primary"
              />
              <div class="flex gap-1">
                <button
                  onClick={props.onCreate}
                  class="flex-1 bg-primary text-primary-content text-[9px] font-black uppercase py-1 rounded hover:opacity-90"
                >
                  ОК
                </button>
                <button
                  onClick={() => {
                    props.setIsCreating(false);
                    props.setNewName("");
                  }}
                  class="px-2 cursor-pointer bg-base-content/10 text-[9px] font-black uppercase py-1 rounded hover:bg-base-content/20"
                >
                  ✕
                </button>
              </div>
            </div>
          </Show>
        </div>
      </div>
      <div class="mt-auto">
        <button class="btn btn-neutral btn-sm w-full text-[10px] font-black uppercase">
          Слияние веток
        </button>
      </div>
    </div>
  );
};

export default VCSBranches;