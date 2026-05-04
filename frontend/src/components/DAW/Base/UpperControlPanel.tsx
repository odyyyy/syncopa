import { Component, Show } from "solid-js";
import ThemeController from "../../utils/ThemeController";
import useProjectManager from "../../../hooks/daw/project/useProjectManager";
import { useProjectContext } from "@/context/daw/project.context";
import { usePlayerContext } from "@/context/daw/player.context";
import useUpperControlPanel from "../../../hooks/daw/useUpperControlPanel";
import ExitProjectModal from "../../utils/ConfirmActionModal";
import { useNavigate } from "@solidjs/router";
import ExportProgressLoading from "../Export/ExportProgressLoading";
import useExportProject from "../../../hooks/daw/export/useExport";
import ProjectMembersAvatars from "../../ProjectsManagement/ProjectMembersAvatars";
import { useCoopContext } from "../../../context/coop/coopsession.context";
import useImportAudio from "../../../hooks/daw/import/useImportAudio";
import ImportAudioModal from "../Import/ImportAudioModal";
import usePlayerManager from "@/hooks/daw/player/usePlayerManager";
import toast from "solid-toast";
import { useVCSContext } from "@/context/vcs/vcs.context";

const UpperControlPanel: Component = () => {
  const { project } = useProjectContext();
  const { time, isPlaying, setPlayerBeatPos, setTotalVolume, totalVolume } =
    usePlayerContext();
  const { startOrPausePlaying } = usePlayerManager();
  const { saveProjectChanges } = useProjectManager();
  const { muteOrUnmuteMasterVolume, setExitModalOpen, exitModalOpen } =
    useUpperControlPanel();
  const { exportOpen, setExportOpen } = useExportProject();
  const { importOpen, setImportOpen } = useImportAudio();
  const { coopSessionMembers, websocketConnection } = useCoopContext();
  
   const { VCSState } = useVCSContext();

  const navigate = useNavigate();

  return (
    <nav class="navbar bg-base-200/50 p-2.5 shadow-sm relative z-40 shrink-0 h-20">
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
            <li class="hover:bg-base-200 border-b border-b-base-300 w-full text-center place-items-center flex ">
              <div class="hover:bg-base-200 cursor-default text-center place-items-center">
                <p
                  class="text-base text-center truncate"
                  title={project()?.title}
                >
                  {project()?.title}
                </p>
              </div>
            </li>
            <li
              classList={{ 
                "disabled": VCSState.isVCSModeActive,
                "cursor-not-allowed": VCSState.isVCSModeActive 
              }}
              title={VCSState.isVCSModeActive ? "Сохранение проекта недоступно в режиме работы с системой контроля версий" : ""}
              onclick={(e) => {
                e.preventDefault();
                
                if (VCSState.isVCSModeActive) return;
            
                saveProjectChanges(project()?.projectId ?? "");
                toast.success("Проект сохранен");
              }}
            >
              <div class={`flex flex-row ${VCSState.isVCSModeActive ? "pointer-events-none opacity-50" : ""}`}>
                <svg
                  class="w-4 h-4 fill-current ml-0.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.681 6.158 17.843.32a1.1 1.1 0 0 0-.771-.32H1.092C.489 0 .001.489.001 1.091v21.817c0 .603.489 1.091 1.091 1.091h21.817c.603 0 1.091-.489 1.091-1.091V6.928c0-.301-.122-.574-.32-.771zM6.549 2.182h6.546v5.819H6.546zm0 19.635v-5.818h10.905v5.818zm15.273 0h-2.185v-6.908c0-.603-.489-1.091-1.091-1.091H5.455c-.603 0-1.091.489-1.091 1.091v6.909H2.182V2.181h2.182V9.09c0 .603.489 1.091 1.091 1.091h8.728c.603 0 1.091-.489 1.091-1.091V2.181h1.344l5.199 5.199z" />
                </svg>
                <a>Сохранить</a>
              </div>
            </li>
            <li
              onClick={(e) => {
                e.preventDefault();
                setImportOpen(true);
              }}
            >
              <div class="flex flex-row">
                <svg
                  class="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4,23H20a1,1,0,0,0,1-1V6a1,1,0,0,0-.293-.707l-4-4A1,1,0,0,0,16,1H4A1,1,0,0,0,3,2V22A1,1,0,0,0,4,23ZM5,3H15.586L19,6.414V21H5Zm11,9a1,1,0,0,1-1,1H13v2a1,1,0,0,1-2,0V13H9a1,1,0,0,1,0-2h2V9a1,1,0,0,1,2,0v2h2A1,1,0,0,1,16,12Z" />
                </svg>
                <a>Импорт</a>
              </div>
            </li>
            <li
              onClick={(e) => {
                e.preventDefault();
                setExportOpen(true);
              }}
            >
              <div class="flex flex-row">
                <svg
                  viewBox="0 0 24 24"
                  class="w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.71 7.71 11 5.41V15a1 1 0 0 0 2 0V5.41l2.29 2.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0-.33-.21 1 1 0 0 0-.76 0 1 1 0 0 0-.33.21l-4 4a1 1 0 1 0 1.42 1.42M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1" />
                </svg>
                <a>Экспорт</a>
              </div>
            </li>
            <li
              class="hover:bg-error/20 rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                setExitModalOpen(true);
              }}
            >
              <div class="flex flex-row hover:bg-error/20 rounded-lg">
                <svg
                  viewBox="0 0 16 16"
                  class="w-5 h-5 fill-error"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.293 3.293a1 1 0 1 1 1.414 1.414L9.414 8l3.293 3.293a1 1 0 0 1-1.414 1.414L8 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L6.586 8 3.293 4.707a1 1 0 0 1 1.414-1.414L8 6.586z" />
                </svg>
                <a class="text-error">Закрыть</a>
              </div>
            </li>
          </ul>
        </div>

        <Show when={exportOpen()}>
          <ExportProgressLoading
            open={exportOpen()}
            onClose={() => setExportOpen(false)}
          />
        </Show>

        <Show when={importOpen()}>
          <ImportAudioModal
            open={importOpen()}
            onClose={() => setImportOpen(false)}
          />
        </Show>

        <Show when={exitModalOpen()}>
          <ExitProjectModal
            title="Закрыть проект? Несохраненные изменения могут быть потеряны!"
            open={exitModalOpen()}
            onClose={() => setExitModalOpen(false)}
            onConfirm={() => {
              setExitModalOpen(false);
              websocketConnection?.close();
              navigate("../");
            }}
          />
        </Show>

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
            <input
              type="checkbox"
              checked
              onChange={muteOrUnmuteMasterVolume}
            />

            <svg
              class="swap-on fill-current h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
            >
              <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>

            <svg
              class="swap-off fill-current h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
            >
              <path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
            </svg>
          </label>

          <input
            type="range"
            min="0"
            max="100"
            value={totalVolume()}
            step="1"
            onChange={(e: Event) => {
              setTotalVolume(Number((e.target as HTMLInputElement).value));
            }}
            class="range range-xs max-w-36 max-h-7"
          />
        </div>
      </div>

      <div class="navbar-end gap-4">
        <ProjectMembersAvatars members={coopSessionMembers} />
        <ThemeController />
      </div>
    </nav>
  );
};

export default UpperControlPanel;
