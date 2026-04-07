import { Component, createSignal, For, Show } from "solid-js";

import ModalMenu from "../ModalMenu";
import { CoopMember } from "../../../types/coop.types";
import AvatarDefault from "../../User/Avatars/AvatarDefault";
import AvatarPicture from "../../User/Avatars/AvatarPicture";

type CoopModalProps = {
  dialogRef?: (el: HTMLDialogElement) => void;

  onClose?: (returnValue: string) => void;
};

const CoopModal: Component<CoopModalProps> = (props) => {
  const [isSessionRunning, setIsSessionRunning] = createSignal(false);

  const projectMembers: CoopMember[] = [
    { id: "1", username: "Алексей", isOwner: true },

    { id: "2", username: "Мария", isOwner: false },

    { id: "3", username: "Иван", isOwner: false },

    { id: "4", username: "Елена", isOwner: false },
  ];

  const sessionMembers: CoopMember[] = [
    {
      id: "1",
      username: "Алексей",
      isOwner: true,
      status: "online",
    },

    {
      id: "2",
      username: "Мария",
      isOwner: false,
      status: "online",
    },
    {
      id: "2",
      username: "Мария",
      isOwner: false,
      status: "online",
    },
    {
      id: "2",
      username: "Мария",
      isOwner: false,
      status: "online",
    },
    {
      id: "2",
      username: "Мария",
      isOwner: false,
      status: "online",
    },
    {
      id: "2",
      username: "Мария",
      isOwner: false,
      status: "online",
    },
  ];

  const sortedSession = () =>
    [...sessionMembers].sort((a, b) =>
      a.isOwner === b.isOwner ? 0 : a.isOwner ? -1 : 1,
    );

  return (
    <ModalMenu
      dialogRef={props.dialogRef}
      onClose={props.onClose}
      class="fixed top-1/2 left-1/2 -translate-x-1/2 transition-all duration-100 -translate-y-1/2 m-0 p-0 w-full border-none bg-transparent overflow-visible"
    >
      <div class="card bg-base-200 rounded-2xl shadow-2xl overflow-hidden border border-base-300 ring-1 ring-black/5">
        <div class="bg-base-200 py-8 border-b border-base-300">
          <h2 class="text-2xl font-black uppercase tracking-widest text-center text-base-content">
            Совместная работа
          </h2>
        </div>

        <div class="flex h-137.5 w-full">
          <div class="w-95 min-w-95 bg-base-200/50 border-r border-base-300 flex flex-col">
            <div class="p-6">
              <h3 class="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-4">
                Команда проекта
              </h3>

              <div class="space-y-3 overflow-y-auto max-h-90 pr-2 custom-scrollbar">
                <For each={projectMembers}>
                  {(user) => (
                    <div class="flex cursor-pointer hover:scale-101 duration-100 transition-all items-center gap-4 p-3 rounded-xl bg-base-300/66 border border-base-300/50 shadow-sm">
                      <Show
                        when={user.avatar}
                        fallback={
                          <AvatarDefault username={user.username} size={10} />
                        }
                      >
                        <AvatarPicture
                          src={user.avatar!}
                          username={user.username}
                          size={10}
                        />
                      </Show>

                      <div class="flex flex-col">
                        <div>
                          <span class="text-sm font-semibold">
                            {user.username}
                          </span>
                          
                          <Show when={user.isOwner}>
                            <span
                              class="text-warning tooltip ml-1"
                              data-tip="Владелец проекта"
                            >
                              <svg
                                class="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                              </svg>
                            </span>
                          </Show>
                        </div>
                        
                        

                        <span class="text-[10px] uppercase opacity-40 font-bold tracking-tighter">
                          {user.isOwner ? "Владелец" : "Участник"}
                        </span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="mt-3 p-6 bg-inherit ">
              <button class="btn btn-neutral btn-block shadow-md group">
                <span class="text-lg group-hover:scale-125 transition-transform">
                  +
                </span>
                Пригласить участника
              </button>
            </div>
          </div>

          <div class="flex-1 bg-base-300 flex flex-col relative w-135">
            <Show
              when={isSessionRunning()}
              fallback={
                <div class="flex flex-col items-center justify-center h-full p-15 text-center bg-base-200">
                  <div class="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center mb-6 text-base-content/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-12 h-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>

                  <h3 class="text-2xl font-bold text-base-content">
                    Сессия неактивна
                  </h3>

                  <p class="text-base-content/50 mt-2 mb-8 max-w-sm">
                    Запустите сессию, чтобы другие участники проекта могли
                    подключиться к работе в реальном времени.
                  </p>

                  <button
                    onClick={() => setIsSessionRunning(true)}
                    class="btn btn-primary btn-wide btn-lg shadow-xs shadow-primary/20"
                  >
                    Начать сессию
                  </button>
                </div>
              }
            >
              <div class="p-6 border-b border-base-200 flex justify-between items-center bg-base-200/80">
                <div class="flex items-center gap-3">
                  <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-95"></span>

                    <span class="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                  </span>

                  <h3 class="text-sm font-bold uppercase tracking-widest text-success">
                    Активная сессия
                  </h3>
                </div>

                <span class="badge badge-outline opacity-50 font-mono text-xs">
                  ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </span>
              </div>

              <div class="p-8 overflow-y-auto flex-1 space-y-4 bg-base-200/85">
                <For each={sortedSession()}>
                  {(user) => (
                    <div
                      class={`flex  cursor-pointer items-center justify-between p-5 rounded-2xl border transition-all duration-100 hover:border-base-content/20 ${
                        user.isOwner
                          ? "bg-base-content/5 border-primary/20 shadow-sm"
                          : "bg-primary/1 border-primary/20  "
                      }`}
                    >
                      <div class="flex items-center gap-5">
                        <Show
                          when={user.avatar}
                          fallback={
                            <AvatarDefault username={user.username} size={14} />
                          }
                        >
                          <AvatarPicture
                            src={user.avatar!}
                            username={user.username}
                            size={14}
                          />
                        </Show>

                        <div class="flex flex-col gap-1">
                          <div class="flex items-center gap-2">
                            <span title={user.username} class="text-lg truncate  font-bold text-base-content">
                              
                              {user.username}
                            </span>

                            <Show when={user.isOwner}>
                              <span
                                class="text-warning tooltip"
                                data-tip="Владелец проекта"
                              >
                                <svg
                                  class="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                                </svg>
                              </span>
                            </Show>
                          </div>

                          <span class="text-xs opacity-50 font-medium">
                            {user.isOwner ? "Владелец" : "Участник"}
                          </span>
                        </div>
                      </div>

                      <div class="flex items-center self-start gap-2 px-1 py-1 bg-success/10 rounded-full">
                        <div class="w-1.5 h-1.5 bg-success rounded-full" />

                      </div>
                    </div>
                  )}
                </For>
              </div>

              <div class="p-6 bg-base-200 border-t border-base-200 flex justify-center">
                <button
                  onClick={() => setIsSessionRunning(false)}
                  class="btn btn-ghost p-2 transition-all duration-200 text-sm text-error hover:bg-error/10"
                >
                  Завершить сессию
                </button>
              </div>
            </Show>
          </div>
        </div>

        {/* Подвал */}
      </div>
    </ModalMenu>
  );
};

export default CoopModal;
