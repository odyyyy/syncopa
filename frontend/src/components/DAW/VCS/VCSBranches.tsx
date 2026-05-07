import { Component, For, Show } from "solid-js";

interface VCSBranchesProps {
  branches: string[];
  selectedBranchInModal: () => string;
  setSelectedBranchInModal: (name: string) => void;
  isCreating: () => boolean;
  setIsCreating: (v: boolean) => void;
  newName: () => string;
  setNewName: (v: string) => void;
  onCreate: () => void;
  currentVersionBranch: string | undefined;
  mergeBranches: (source: string) => void;

  openSwitchModal: (callback: () => void | Promise<void>) => void;
}

const VCSBranches: Component<VCSBranchesProps> = (props) => {
  const canMerge = () =>
    props.currentVersionBranch &&
    props.selectedBranchInModal() !== props.currentVersionBranch;

  return (
    <div class="w-56 bg-base-200 border-r border-base-content/5 p-4 flex flex-col gap-4">
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <label class="text-[9px] font-black uppercase opacity-30 mb-2 block ml-2 tracking-widest">
          Ветки
        </label>
        <div class="space-y-1">
          <For each={props.branches}>
            {(branch) => (
              <button
                onClick={() => props.setSelectedBranchInModal(branch)}
                classList={{
                  "bg-primary text-primary-content shadow-md z-10":
                    props.selectedBranchInModal() === branch,

                  "bg-primary-content/10 text-primary border border-primary/20":
                    props.currentVersionBranch === branch &&
                    props.selectedBranchInModal() !== branch,

                  "hover:bg-base-300 text-base-content/70":
                    props.selectedBranchInModal() !== branch &&
                    props.currentVersionBranch !== branch,
                }}
                class="w-full text-left px-3 py-2.5 cursor-pointer rounded-lg text-xs font-bold transition-all flex items-center justify-between border border-transparent"
              >
                <div class="flex items-center gap-2">
                  {branch}
                  <Show when={props.currentVersionBranch === branch}>
                    <span
                      class={`text-[8px] px-1 rounded ${props.selectedBranchInModal() === branch ? "bg-primary-content text-primary" : "bg-primary text-primary-content"}`}
                    >
                      ТЕКУЩАЯ
                    </span>
                  </Show>
                </div>

                <Show when={props.selectedBranchInModal() === branch}>
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
                placeholder="Название..."
                value={props.newName()}
                onInput={(e) => props.setNewName(e.currentTarget.value)}
                class="w-full bg-base-100 border-none outline-none rounded px-2 py-1.5 text-xs font-bold mb-2 focus:ring-1 ring-primary"
              />
              <div class="flex gap-1">
                <button
                  onClick={() => { props.openSwitchModal(() => props.onCreate()); }}
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

      <div class="pt-4 border-t border-base-content/5 space-y-1">
        <Show
          when={canMerge()}
          fallback={
            <div class="text-[9px] text-center opacity-20 font-bold uppercase py-4 border border-dashed border-base-content/10 rounded-xl">
              Выберите ветку для слияния
            </div>
          }
        >
          <div class="bg-primary/5 rounded-xl p-3 border border-primary/10 animate-in slide-in-from-bottom-2 duration-300">
            <div class="text-[11px] font-black uppercase opacity-40 mb-2 tracking-tighter">
              Слияние в{" "}
              <span class="text-primary">{props.currentVersionBranch}</span>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <div class="flex-1 h-px bg-primary/20"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-3 text-primary rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <div class="flex-1 h-px bg-primary/20"></div>
            </div>

            <button
              onClick={() => props.mergeBranches(props.selectedBranchInModal())}
              class="btn btn-primary btn-sm w-full no-animation group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-3.5 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span class="text-[10px] font-black uppercase">
                 {props.selectedBranchInModal()}
              </span>
            </button>
          </div>
        </Show>

        <p class="text-[10px] text-center opacity-30 leading-tight px-2 italic">
          Слияние перенесет изменения из выбранной ветки в вашу текущую версию
        </p>
      </div>
    </div>
  );
};

export default VCSBranches;
