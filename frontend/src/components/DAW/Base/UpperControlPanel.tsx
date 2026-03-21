import { Component, Show } from "solid-js";
import ThemeController from "../../utils/ThemeController";
import useProjectPayloadManager from "../../../hooks/daw/useProjectPayloadManager";
import { useProjectContext } from "../../../hooks/daw/context/useProjectContext";
import { usePlayerContext } from "../../../hooks/daw/context/usePlayerContext";
import useUpperControlPanel from "../../../hooks/daw/useUpperControlPanel";
import * as Tone from "tone";

const UpperControlPanel: Component = () => {
  const { project } = useProjectContext();
  const {
    time,
    isPlaying,
    startOrPausePlaying,
    setPlayerBeatPos,
    totalVolume,
  } = usePlayerContext();
  const { saveProjectChanges } = useProjectPayloadManager();
  const { changeMasterVolume,muteOrUnmuteMasterVolume } = useUpperControlPanel();

  return (
    <nav class="navbar bg-header p-2.5 shadow-sm relative z-40 shrink-0 ">
      <div class="navbar-start gap-1">
        <div class="dropdown dropdown-hover">
          <div tabindex="0" role="button" class="btn-main m-1 p-2">
            <svg
              viewBox="0 0 16 16"
              class="h-5 w-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2 13.122a1 1 0 0 0 .741.966l7 1.876A1 1 0 0 0 11 14.998V14h2a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-2v-.994A1 1 0 0 0 9.741.04l-7 1.876A1 1 0 0 0 2 2.882zM9 2.31v11.384l-5-1.34V3.65zM11 12V4h1v8z"
              />
            </svg>
            Проект
          </div>
          <ul
            tabindex="-1"
            class="dropdown-content rounded-2xl menu bg-base-200 z-1 w-40 p-2 shadow-sm"
          >
            <li class="hover:bg-base-200 border-b border-b-base-300 w-full">
              <div class="hover:bg-base-200 cursor-default ">
                <p class="text-base text-center">{project()?.title}</p>
              </div>
            </li>
            <li>
              <a>Новый проект</a>
            </li>
            <li
              onclick={(e) => {
                e.preventDefault();
                saveProjectChanges(project()?.projectId ?? "");
              }}
            >
              <a>Сохранить</a>
            </li>
            <li>
              <a>Импорт</a>
            </li>
            <li>
              <a>Экспорт</a>
            </li>
            <li>
              <a>Закрыть</a>
            </li>
          </ul>
        </div>

        {/* Undo */}
        <button
          class="btn-main bg-header tooltip tooltip-bottom"
          data-tip="Действие назад"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 "
            fill="none"
          >
            <path
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 9v5h5m11 2c-.497-4.5-3.367-8-8-8-2.73 0-5.929 2.268-7.294 5.5"
            />
          </svg>
        </button>
        {/* Redo  */}
        <button
          class="btn-main bg-header tooltip tooltip-bottom"
          data-tip="Действие вперед"
        >
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 rotate-y-180"
            fill="none"
          >
            <path
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 9v5h5m11 2c-.497-4.5-3.367-8-8-8-2.73 0-5.929 2.268-7.294 5.5"
            />
          </svg>
        </button>
      </div>

      <div class="navbar-center">
        <ul class="menu menu-horizontal bg-base-200 rounded-box">
          {/* Backward */}
          <li
            class="tooltip tooltip-bottom"
            data-tip="Воспроизвести с начала"
            onclick={() => setPlayerBeatPos(0)}
          >
            <a>
              <svg
                fill="currentColor"
                stroke="currentColor"
                class="w-5 h-5"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M236 70.653v114.694a16 16 0 0 1-24.652 13.459L124 142.654v42.693a16 16 0 0 1-24.652 13.459l-89.206-57.347a16 16 0 0 1 0-26.918l89.206-57.347A16 16 0 0 1 124 70.654v42.692l87.348-56.152A16 16 0 0 1 236 70.654" />
              </svg>
            </a>
          </li>

          {/* Play */}
          <li
            class="tooltip tooltip-bottom"
            data-tip={isPlaying() ? "Пауза" : "Пуск"}
            onclick={startOrPausePlaying}
          >
            <a>
              <Show when={!isPlaying()}>
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  class="w-5 h-5"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.008 12.897a.644.644 0 0 1-.91-.227.7.7 0 0 1-.098-.364V3.693C4 3.31 4.296 3 4.662 3a.64.64 0 0 1 .346.103l6.677 4.306a.713.713 0 0 1 0 1.182z" />
                </svg>
              </Show>
              <Show when={isPlaying()}>
                <svg
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  fill="currentColor"
                  stroke="currentColor"
                  class="w-5 h-5"
                  stroke-linejoin="round"
                  stroke-miterlimit="1.414"
                >
                  <path d="M5.5 3.68A.684.684 0 0 0 4.822 3H3.466a.684.684 0 0 0-.678.68v8.631c0 .374.303.677.678.677h1.355a.68.68 0 0 0 .678-.677V3.68z" />
                  <path d="M11.5 3.68a.685.685 0 0 0-.68-.681H9.46a.683.683 0 0 0-.68.68v8.628c0 .376.304.68.68.68h1.36c.373 0 .68-.307.68-.68z" />
                </svg>
              </Show>
            </a>
          </li>
          {/* Record */}
          <li class="tooltip tooltip-bottom tooltip-error" data-tip="Запись">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 fill-red-500"
                viewBox="0 0 52 52"
              >
                <path d="M26 8c9.9 0 18 8.1 18 18s-8.1 18-18 18S8 35.9 8 26 16.1 8 26 8" />
              </svg>
            </a>
          </li>
          <li class="text-xl ml-5 text-base-content/95 font-bold hover:bg">
            {time()}
          </li>
        </ul>
        <div class="flex items-center ml-3">
          <label class="swap mr-2 bg-base-content/5 rounded-lg p-0.5">
            <input type="checkbox" checked onChange={muteOrUnmuteMasterVolume} />
          
            <svg
              class="swap-on fill-current h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24">
              <path
                d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
          
            <svg
              class="swap-off fill-current h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24">
              <path
                d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
            </svg>
          </label>

          <input
            type="range"
            min="0"
            max="100"
            value={totalVolume()}
            step="1"
            onChange={(e: Event) => {
              changeMasterVolume(Number((e.target as HTMLInputElement).value));
            }}
            class="range range-xs max-w-36 max-h-7"
          />
        </div>
      </div>

      <div class="navbar-end gap-4">
        {/* Volume Range */}

        {/*<button class="btn p-2 bg-primary/80 text-neutral light:text-white">
          <svg
            viewBox="0 0 15 15"
            fill="currentColor"
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 1.5C0 0.671573 0.671573 0 1.5 0H10.0858C10.4836 0 10.8651 0.158035 11.1464 0.43934L14.5607 3.85355C14.842 4.13486 15 4.51639 15 4.91421V13.5C15 14.3284 14.3284 15 13.5 15H11V11.5C11 10.6716 10.3284 10 9.5 10H5.5C4.67157 10 4 10.6716 4 11.5V15H1.5C0.671573 15 0 14.3284 0 13.5V1.5Z"
              fill="currentColor"
            />
            <path
              d="M5 15H10V11.5C10 11.2239 9.77614 11 9.5 11H5.5C5.22386 11 5 11.2239 5 11.5V15Z"
              fill="currentColor"
            />
          </svg>
          Сохранить
        </button>
        <button class="btn p-2 bg-base-content text-neutral light:text-white">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 icon flat-color fill-neutral"
          >
            <path d="M21 20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 6 6 0 0 1 6-6h6a6 6 0 0 1 6 6m-9-8a5 5 0 1 0-5-5 5 5 0 0 0 5 5" />
          </svg>
          Пригласить
        </button>*/}

        <ThemeController />
      </div>
    </nav>
  );
};

export default UpperControlPanel;
