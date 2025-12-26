import { Component } from 'solid-js';

interface ProjectItemProps {
  name: string;
  updatedAt: string; // Формат "20.11.2025" или "5 дн. назад"
  bpm?: number;
  sampleRate?: string;
  duration?: string;
  isFavorite?: boolean;
}

const ProjectItemCard: Component<ProjectItemProps> = (props) => {
  return (
    <div class="group relative flex flex-col bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 rounded-lg p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-black/40">
      
      {/* Верхняя часть: Название и Статус */}
      <div class="flex justify-between items-start mb-3">
        <h2 class="text-lg font-semibold text-zinc-100 truncate pr-4 group-hover:text-white">
          {props.name}
        </h2>
        <div class="flex items-center gap-2">
          {props.isFavorite && (
            <span class="text-yellow-500 text-xs">★</span>
          )}
          {!props.isFavorite && (
            <span class="text-yellow-500 text-xs">&nbsp;&nbsp;</span>
          )}
          <button class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Мета-данные (мои дополнения для DAW) */}
      <div class="grid grid-cols-2 gap-y-2 mb-4 text-[13px] text-zinc-400 font-medium">
        <div class="flex items-center gap-2">
          <span class="text-zinc-600">BPM:</span>
          <span>{props.bpm || "-"}</span>
        </div>
        <div class="flex items-center gap-2 justify-end">
          <span class="text-zinc-600">Length:</span>
          <span>{props.duration || '-'}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-zinc-600">Rate:</span>
          <span>{props.sampleRate || '-'}</span>
        </div>
      </div>

      {/* Нижняя часть: Дата изменения */}
      <div class="mt-auto pt-3 border-t border-zinc-800 flex items-center justify-between">
        <span class="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
          Last modified
        </span>
        <span class="text-[11px] text-zinc-400">
          {props.updatedAt}
        </span>
      </div>

      {/* Эффект свечения при наведении */}
      <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
    </div>
  );
};

export default ProjectItemCard;