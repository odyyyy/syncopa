import { A } from "@solidjs/router";
import { Component, createResource, Show } from "solid-js";
import ProjectItemCard from "../components/ProjectManagement/ProjectItemCard";

const Projects: Component = () => {
  
  // Получение данных
  //const projectsList = createResource(fetchProjectsList);
  const projectsList = [{}]
  
  // Разметка
  return (
    // Header 1/2

    <div class="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <nav class="navbar w-full bg-base-300">
          <label
            for="my-drawer-4"
            aria-label="open sidebar"
            class="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
              class="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div class="px-4 font-['BaseTextCyrillicFont']">Ваши проекты</div>
        </nav>
        <div class="p-4">
          {/* Content */}
          <main class="relative h-screen w-full flex flex-row  items-start gap-5  overflow-hidden">
            <Show when={projectsList} fallback=<p>Loading</p>>
              <ProjectItemCard 
                name="Midnight Synthwave" 
                updatedAt="20.11.2025" 
                bpm={128} 
                isFavorite={true} 
              />
            </Show>
            <Show when={projectsList} fallback=<p>Loading</p>>
              <ProjectItemCard 
                name="Midnight Synthwave" 
                updatedAt="20.11.2025" 
                bpm={128} 
                isFavorite={false} 
              />
            </Show>
            <Show when={projectsList} fallback=<p>Loading</p>>
              <ProjectItemCard 
                name="Midnight Synthwave" 
                updatedAt="20.11.2025" 
                bpm={128} 
                isFavorite={true} 
              />
            </Show>

    
            
            <button
                  class="group relative flex flex-col items-center justify-center bg-zinc-900/30 border-2 border-dashed border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/60 rounded-lg p-4 transition-all duration-200 cursor-pointer max-h-42 min-w-3xs h-full"
                >
                  {/* Контейнер для иконки с эффектом масштабирования */}
                  <div class="flex flex-col items-center gap-3 transition-transform duration-200 group-hover:scale-110">
                    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-zinc-700 text-zinc-400 group-hover:text-white transition-colors">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="w-8 h-8" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        stroke-width="2.5"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    
                    <span class="text-sm font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">
                      New Project
                    </span>
                  </div>
            
                  {/* Информационный текст внизу (опционально, для симметрии с датой) */}
                  {/*<div class="absolute bottom-4 text-[10px] text-zinc-600 uppercase font-medium">
                    Start from scratch
                  </div>*/}
                </button>
            
            
          </main>
        </div>
      </div>

      {/* Header 2/2 */}
      <div class="drawer-side is-drawer-close:overflow-visible">
        <label
          for="my-drawer-4"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul class="menu w-full grow">
            <li>
              <button
                class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Главная"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                  class="my-1.5 inline-block size-4"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span class="is-drawer-close:hidden">Homepage</span>
              </button>
            </li>

            <li>
              <button
                class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Настройки"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                  class="my-1.5 inline-block size-4"
                >
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
                <span class="is-drawer-close:hidden">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Projects;

function showCreatePopup() {}
