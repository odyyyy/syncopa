import { Component } from "solid-js";

const VCSConflicts: Component = () => {
  return (
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
  );
};

export default VCSConflicts;