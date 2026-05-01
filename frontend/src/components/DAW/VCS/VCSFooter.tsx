import { Component } from "solid-js";

const VCSFooter: Component = () => {
  return (
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
              <kbd class="kbd kbd-sm bg-base-content/5">shift</kbd>+
              <kbd class="kbd kbd-sm bg-base-content/5">enter</kbd>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VCSFooter;