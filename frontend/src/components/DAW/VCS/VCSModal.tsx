import { Component, createSignal, For, Show } from "solid-js";
import ModalMenu from "../ModalMenu";

type Commit = {
  id: string;
  branch: string;
  msg: string;
  author: string;
  date: string;
  color: string;
  description?: string;
};

const COMMITS: Commit[] = [
  {
    id: "a1",
    branch: "main",
    msg: "Набросок басовой линии",
    author: "Alex",
    date: "2 часа назад",
    color: "#570df8",
    description:
      "Использовал Serum с кастомным пресетом. Нужно подрезать низ на 40Гц.",
  },
  {
    id: "b1",
    branch: "feature/vocals",
    msg: "Запись припева (дубли)",
    author: "Max",
    date: "1 час назад",
    color: "#f000b8",
    description: "Три удачных дубля, выбрал основной. Эффекты пока не вешал.",
  },
  {
    id: "a2",
    branch: "main",
    msg: "Мастеринг: правки EQ",
    author: "Alex",
    date: "30 мин назад",
    color: "#570df8",
    description: "Добавил 2дб на 12кГц для воздуха.",
  },
  {
    id: "b2",
    branch: "feature/vocals",
    msg: "Деэссер на вокале",
    author: "Max",
    date: "10 мин назад",
    color: "#f000b8",
    description: "Убрал свистящие в районе 7кГц.",
  },
];

const BRANCHES = ["main", "feature/vocals", "experimental-synth"];

const VCSModal: Component<{ dialogRef: (el: HTMLDialogElement) => void }> = (
  props,
) => {
  const [currentBranch, setCurrentBranch] = createSignal("main");
  const [viewMode, setViewMode] = createSignal<"all" | "branch">("all");
  const [activeTab, setActiveTab] = createSignal<"history" | "conflicts">(
    "history",
  );
  const [selectedCommit, setSelectedCommit] = createSignal<Commit | null>(null);

  return (
    <ModalMenu dialogRef={props.dialogRef}>
      <div class="w-[1100px] h-[750px] bg-base-100 rounded-[2rem] shadow-2xl border border-neutral/20 overflow-hidden flex flex-col select-none">
        {/* Header */}
        <div class="p-6 bg-base-200 border-b border-base-content/5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-primary/10 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-black tracking-tight uppercase leading-none">
                Контроль версий
              </h2>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="badge badge-primary badge-sm font-bold uppercase">
                  {currentBranch()}
                </span>
              </div>
            </div>
          </div>

          {/* Центральные вкладки */}
          <div class="flex bg-base-300 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("history")}
              class={`px-8 py-2 rounded-lg text-[11px] font-black uppercase transition-all ${activeTab() === "history" ? "bg-base-100 shadow-md text-primary" : "opacity-40 hover:opacity-100"}`}
            >
              История
            </button>
            <button
              onClick={() => setActiveTab("conflicts")}
              class={`px-8 py-2 rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-2 ${activeTab() === "conflicts" ? "bg-error text-error-content shadow-md" : "opacity-40 hover:opacity-100"}`}
            >
              Конфликты{" "}
              <div class="badge badge-xs badge-ghost opacity-50">0</div>
            </button>
          </div>

          {/* Переключатель графа */}
          <div class="flex bg-base-300 p-1 rounded-xl gap-1">
            <button
              onClick={() => setViewMode("all")}
              class={`px-4 py-1.5 rounded-lg text-[10px] cursor-pointer font-black uppercase transition-all ${viewMode() === "all" ? "bg-base-100 shadow-sm" : "opacity-40 hover:opacity-100"}`}
            >
              Весь проект
            </button>
            <button
              onClick={() => setViewMode("branch")}
              class={`px-4 py-1.5 rounded-lg text-[10px] cursor-pointer font-black uppercase transition-all ${viewMode() === "branch" ? "bg-base-100 shadow-sm" : "opacity-40 hover:opacity-100"}`}
            >
              Текущая ветка
            </button>
          </div>
        </div>

        <div class="flex flex-1 overflow-hidden">
          {/* Sidebar: Branches */}
          <div class="w-56 bg-base-200 border-r border-base-content/5 p-4 flex flex-col gap-4">
            <div>
              <label class="text-[9px] font-black uppercase opacity-30 mb-2 block ml-2 tracking-widest">
                Ветки
              </label>
              <div class="space-y-1">
                <For each={BRANCHES}>
                  {(branch) => (
                    <button
                      onClick={() => setCurrentBranch(branch)}
                      class={`w-full text-left px-3 py-2 cursor-pointer rounded-lg text-xs font-bold transition-all flex items-center justify-between ${currentBranch() === branch ? "bg-primary text-primary-content shadow-lg" : "hover:bg-base-300 opacity-60"}`}
                    >
                      {branch}
                      <Show when={currentBranch() === branch}>
                        <div class="size-1.5 bg-current rounded-full animate-pulse" />
                      </Show>
                    </button>
                  )}
                </For>
                <button class="w-full mt-2 cursor-pointer border border-dashed border-base-content/20 py-2 rounded-lg text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-all">
                  + Новая ветка
                </button>
              </div>
            </div>
            <div class="mt-auto">
              <button class="btn btn-neutral btn-sm w-full text-[10px] font-black uppercase">
                Слияние веток
              </button>
            </div>
          </div>

          {/* Main Area */}
          <div class="flex-1 bg-base-200/50 flex overflow-hidden">
            <Show when={activeTab() === "history"}>
              {/* Visual Commit Graph */}
              <div class="flex-1 overflow-y-auto relative p-6 custom-scrollbar">
                <div class="absolute left-10 top-0 bottom-0 w-0.5 bg-neutral/10" />
                <div class="space-y-8 relative">
                  <For each={COMMITS}>
                    {(commit, i) => (
                      <div
                        onClick={() => setSelectedCommit(commit)}
                        class={`flex items-start gap-6 group cursor-pointer transition-all ${selectedCommit()?.id === commit.id ? "translate-x-2" : ""}`}
                      >
                        <div class="relative z-10 mt-1.5">
                          <div
                            class={`size-4 rounded-full border-4 border-base-100 shadow-sm transition-transform ${selectedCommit()?.id === commit.id ? "scale-125" : ""}`}
                            style={{ "background-color": commit.color }}
                          />
                          <Show when={i() < COMMITS.length - 1}>
                            <div class="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-neutral/10" />
                          </Show>
                        </div>

                        <div
                          class={`flex-1 p-4 rounded-2xl border transition-all ${selectedCommit()?.id === commit.id ? "bg-base-300 border-primary/40 shadow-md" : "bg-base-300/60 border-transparent hover:bg-base-200"}`}
                        >
                          <div class="flex justify-between items-start mb-1">
                            <span class="text-sm font-bold tracking-tight">
                              {commit.msg}
                            </span>
                            <span class="text-[10px] font-mono opacity-30 uppercase">
                              {commit.id}
                            </span>
                          </div>
                          <div class="flex items-center gap-3">
                            <span class="text-[10px] font-black uppercase text-primary">
                              {commit.author}
                            </span>
                            <span class="text-[10px] opacity-30 italic">
                              {commit.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Right Inspector Panel */}
              <div
                class={`w-72 bg-base-200 border-l border-base-content/5 flex flex-col transition-all duration-300 ${selectedCommit() ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute right-0"}`}
              >
                <Show when={selectedCommit()}>
                  <div class="p-6 flex flex-col h-full">
                    <div class="mb-6">
                      <label class="text-[9px] font-black uppercase opacity-30 block mb-2 tracking-widest">
                        Инспектор версии
                      </label>
                      <h4 class="text-sm font-black uppercase text-primary mb-1">
                        {selectedCommit()?.id}
                      </h4>
                      <p class="text-[11px] font-bold opacity-60 leading-relaxed">
                        {selectedCommit()?.description ||
                          "Нет детального описания для этой версии."}
                      </p>
                    </div>

                    <div class="space-y-2 mt-auto">
                      <button class="btn btn-neutral btn-block btn-sm rounded-xl text-[10px] font-black uppercase">
                        Перейти к версии
                      </button>
                      <button class="btn btn-primary btn-block btn-sm rounded-xl text-[10px] font-black uppercase">
                        Откатиться к версии
                      </button>
                      <button
                        onClick={() => setSelectedCommit(null)}
                        class="btn btn-ghost btn-block btn-xs text-[9px] font-bold uppercase opacity-30 hover:opacity-80 mt-4"
                      >
                        Закрыть панель
                      </button>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>

            <Show when={activeTab() === "conflicts"}>
              <div class="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-16 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 class="text-lg font-black uppercase">
                  Конфликтов не обнаружено
                </h3>
                <p class="text-xs font-bold max-w-xs mt-2">
                  Все изменения синхронизированы и готовы к слиянию без
                  вмешательства.
                </p>
              </div>
            </Show>
          </div>
        </div>

        {/* Footer: Commit Box */}
        <div class="p-6 bg-base-300 flex flex-col gap-4 border-t border-black/20">
          <div class="flex flex-col gap-2">
            <label class="text-[9px] font-black uppercase opacity-30 ml-2 tracking-widest">
              Зафиксировать новую версию проекта
            </label>
            <div class="flex gap-4 items-end">
              <textarea
                placeholder="Сообщение к версии..."
                class="textarea textarea-bordered bg-base-200/50 rounded-2xl w-full h-24 text-sm font-bold focus:outline-primary resize-none p-4 shadow-inner"
              />
              <button class="btn btn-primary h-24 w-40 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex flex-col gap-1 hover:scale-[1.02] transition-transform">
                <span class="text-[1.1em] tracking-tight">ЗАФИКСИРОВАТЬ</span>
                <div>
                  <kbd class="kbd kbd-sm bg-base-content/10">shift</kbd>+<kbd class="kbd kbd-sm bg-base-content/10">enter</kbd>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalMenu>
  );
};

export default VCSModal;
