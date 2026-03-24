import { Component, createSignal, For, JSX } from "solid-js";
import ModalMenu from "../ModalMenu";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: "leads", name: "Leads", icon: "⚡", color: "from-yellow-400/20" },
  { id: "pads", name: "Pads", icon: "☁️", color: "from-blue-400/20" },
  { id: "bass", name: "Bass", icon: "🎸", color: "from-red-400/20" },
  { id: "drums", name: "Drums", icon: "🥁", color: "from-green-400/20" },
  { id: "keys", name: "Keys", icon: "🎹", color: "from-purple-400/20" },
  { id: "fx", name: "FX", icon: "✨", color: "from-pink-400/20" },
];

const PresetChooseModal: Component<{
  modalRef: (el: HTMLDialogElement) => void;
  onSelect: (preset: string) => void;
}> = (props) => {
  let modal!: HTMLDialogElement;
  const [activeTab, setActiveTab] = createSignal("leads");

  return (
    <ModalMenu
      dialogRef={(el) => {
        modal = el;
        props.modalRef(el);
      }}
      onClose={() => {}}
    >
      <div class="w-130 bg-base-200 dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-black/5 dark:border-white/10">
        <div class="p-6 pb-2">
          <div class="flex items-center justify-center mb-4">
            <h3 class="text-xl font-black tracking-tight opacity-80 uppercase text-center">
              Библиотека пресетов инструментов
            </h3>
          </div>

          <div class="relative group">
            <input
              type="text"
              placeholder="Название пресета"
              class="w-full bg-base-300 dark:bg-white/5 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
            <svg
              class="size-5 absolute left-4 top-3 opacity-20 group-focus-within:opacity-100 group-focus-within:text-primary transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div class="flex gap-2 px-6 py-3 overflow-x-auto no-scrollbar">
          <For each={CATEGORIES}>
            {(cat) => (
              <button
                onClick={() => setActiveTab(cat.id)}
                class={`flex flex-col items-center justify-center min-w-17.5 aspect-square rounded-2xl transition-all border cursor-pointer
                  ${
                    activeTab() === cat.id
                      ? `bg-linear-to-br ${cat.color} to-transparent border-primary/20 scale-105 shadow-sm`
                      : `bg-transparent border-transparent opacity-40 hover:opacity-100 hover:bg-base-content/4 dark:hover:bg-white/5`
                  }`}
              >
                <span class="text-xl mb-1">{cat.icon}</span>
                <span class="text-[10px] font-bold uppercase tracking-tighter">
                  {cat.name}
                </span>
              </button>
            )}
          </For>
        </div>

        <div class="flex-1 max-h-85 overflow-y-auto px-6 py-2 outline-none">
          <div class="grid grid-cols-2 gap-3 mb-6">
            <For each={[1, 2, 3, 4, 5, 6, 7, 8]}>
              {(i) => (
                <div
                  onClick={() => props.onSelect(`Preset ${i}`)}
                  class="group relative flex flex-col p-4 rounded-2xl bg-base-300 dark:bg-white/5 hover:bg-base-content/5 dark:hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-black/5 dark:hover:border-white/10 hover:shadow-md"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-[9px] font-black text-primary py-0.5 px-1.5 bg-black/5 dark:bg-white/10 rounded uppercase tracking-widest opacity-60">
                      {activeTab()}
                    </span>
                    <button class="size-5 flex items-center justify-center rounded-full bg-base-content/10 dark:bg-neutral-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        class="size-3 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <h4 class="text-sm font-semibold tracking-tight truncate">
                    Crystal Waves 0{i}
                  </h4>
                  <p class="text-[10px] opacity-40 mt-1 truncate italic">
                    Smooth, evolving texture
                  </p>
                </div>
              )}
            </For>
          </div>
        </div>

        <div class="px-6 py-4 bg-base-100/33 dark:bg-black/20 flex justify-between items-center border-t border-black/5 dark:border-white/5">
          <div class="flex gap-4">
            <div class="flex flex-col">
              <span class="text-[8px] opacity-40 font-bold uppercase">
                Всего
              </span>
              <span class="text-xs font-mono">1,240</span>
            </div>
            <div class="flex flex-col border-l border-black/10 dark:border-white/10 pl-4">
              <span class="text-[8px] opacity-40 font-bold uppercase">
                Текущий пресет
              </span>
              <span class="text-xs font-mono">Preset Name</span>
            </div>
          </div>
          <button class="btn btn-primary btn-sm rounded-xl px-6 font-bold shadow-lg shadow-primary/5">
            Создать пресет
          </button>
        </div>
      </div>
    </ModalMenu>
  );
};

export default PresetChooseModal;
