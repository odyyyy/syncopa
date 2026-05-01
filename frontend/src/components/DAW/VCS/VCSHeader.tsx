import { Component } from "solid-js";

interface VCSHeaderProps {
  currentBranch: () => string;
  activeTab: () => "history" | "conflicts";
  setActiveTab: (v: "history" | "conflicts") => void;
  viewMode: () => "all" | "branch";
  setViewMode: (v: "all" | "branch") => void;
}

const VCSHeader: Component<VCSHeaderProps> = (props) => {
  return (
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
              {props.currentBranch()}
            </span>
          </div>
        </div>
      </div>

      <div class="flex bg-base-300 p-1 rounded-xl">
        <button
          onClick={() => props.setActiveTab("history")}
          class={`px-8 py-2 rounded-lg text-[11px] font-black uppercase transition-all ${
            props.activeTab() === "history"
              ? "bg-base-100 shadow-md text-primary"
              : "opacity-40 hover:opacity-100"
          }`}
        >
          История
        </button>
        <button
          onClick={() => props.setActiveTab("conflicts")}
          class={`px-8 py-2 rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-2 ${
            props.activeTab() === "conflicts"
              ? "bg-error text-error-content shadow-md"
              : "opacity-40 hover:opacity-100"
          }`}
        >
          Конфликты <div class="badge badge-xs badge-ghost opacity-50">0</div>
        </button>
      </div>

      <div class="flex bg-base-300 p-1 rounded-xl gap-1">
        <button
          onClick={() => props.setViewMode("all")}
          class={`px-4 py-1.5 rounded-lg text-[10px] cursor-pointer font-black uppercase transition-all ${
            props.viewMode() === "all" ? "bg-base-100 shadow-sm" : "opacity-40 hover:opacity-100"
          }`}
        >
          Весь проект
        </button>
        <button
          onClick={() => props.setViewMode("branch")}
          class={`px-4 py-1.5 rounded-lg text-[10px] cursor-pointer font-black uppercase transition-all ${
            props.viewMode() === "branch" ? "bg-base-100 shadow-sm" : "opacity-40 hover:opacity-100"
          }`}
        >
          Текущая ветка
        </button>
      </div>
    </div>
  );
};

export default VCSHeader;