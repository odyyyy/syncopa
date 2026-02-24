import { A } from "@solidjs/router";
import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";

const ProjectCreatePopup: Component = () => {
  let dialogRef: HTMLDialogElement | undefined;

  const openModal = () => {
    dialogRef?.showModal();
  };

  return (
    <div>
      <button
        onclick={openModal}
        class="group relative flex flex-col items-center justify-center bg-base-300 border-2 border-dashed border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/60 rounded-lg p-10 transition-all duration-200 cursor-pointer  w-full h-[220px]"
      >
        {/* Контейнер для иконки с эффектом масштабирования */}
        <div class="flex flex-col items-center gap-3 transition-transform duration-200 group-hover:scale-110">
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-zinc-700 text-zinc-400 group-hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>

          <span class="text-sm font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">
            Новый проект
          </span>
        </div>

        {/* Информационный текст внизу (опционально, для симметрии с датой) */}
        {/*<div class="absolute bottom-4 text-[10px] text-zinc-600 uppercase font-medium">
              Start from scratch
            </div>*/}
      </button>
      <dialog ref={dialogRef} class="modal">
        <div class="modal-box flex items-center justify-center flex-col gap-4 bg-base-200">
          <h3 class="text-lg font-bold mb-5 ">Создать новый проект</h3>
          <form id="create-project" name="create-project">
            <label class="input ">
              <svg
                class="h-[1em] opacity-80 "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 6L19 3.99999"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19 17L19 4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 17L9 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 17C9 18.1046 8.10457 19 7 19C5.89543 19 5 18.1046 5 17C5 15.8954 5.89543 15 7 15C7.59735 15 8.13353 15.2619 8.5 15.6771C8.81118 16.0297 9 16.4928 9 17Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19 17C19 18.1046 18.1046 19 17 19C15.8954 19 15 18.1046 15 17C15 15.8954 15.8954 15 17 15C17.5973 15 18.1335 15.2619 18.5 15.6771C18.8112 16.0297 19 16.4928 19 17Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                type="text"
                class=""
                required
                placeholder="Название проекта"
                minlength="3"
                maxlength="64"
              />
            </label>
            <p class="validator-hint">
              Длина название не должна превышать 64 символов
            </p>
            <details class="collapse bg-base-300 border-base-300 border">
              <summary class="collapse-title font-semibold">
                + Добавить участников проекта
              </summary>
              <div class="collapse-content ">
                <label class="input ">
                  <svg
                    class="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-width="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <input
                    type="text"
                    placeholder="Никнейм участника"
                    maxlength="64"
                    form="create-project"
                  />
                </label>
              </div>

              {/*<ul
                tabIndex="-1"
                class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-1 shadow-sm"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>*/}

              <ul class="list bg-base-300 flex rounded-box shadow-md gap-2">
                <li class="list-row hover:bg-base-200 cursor-pointer">
                  <div>
                    <img
                      class="size-5  rounded-box"
                      src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                    />
                  </div>
                  <div>
                    <div>Dio Lupa</div>
                  </div>
                </li>

                <li class="list-row cursor-pointer hover:bg-base-200">
                  <div>
                    <img
                      class="size-5  rounded-box"
                      src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                    />
                  </div>
                  <div>
                    <div>userabc</div>
                  </div>
                </li>

                <li class="list-row cursor-pointer hover:bg-base-200">
                  <div>
                    <img
                      class="size-5  rounded-box"
                      src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                    />
                  </div>
                  <div>
                    <div>Test</div>
                  </div>
                </li>
              </ul>
            </details>
          </form>

          <button
            class="btn btn-neutral p-5 rounded-xl"
            type="submit"
            form="create-project"
          >
            Создать
          </button>
        </div>

        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ProjectCreatePopup;
