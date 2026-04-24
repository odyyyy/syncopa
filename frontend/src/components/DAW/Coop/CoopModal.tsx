import { Component, createSignal, For, Show } from "solid-js";

import ModalMenu from "../ModalMenu";
import AvatarDefault from "../../User/Avatars/AvatarDefault";
import AvatarPicture from "../../User/Avatars/AvatarPicture";
import { useProjectContext } from "@/context/daw/project.context";
import { userData } from "../../../store/user";
import { useCoopSession } from "../../../context/coop/coopsession.context";

type CoopModalProps = {
  dialogRef: (el: HTMLDialogElement) => void;
  onClose?: (returnValue: string) => void;
};

const CoopModal: Component<CoopModalProps> = (props) => {
  let modal!: HTMLDialogElement;

  const [isSessionRunning, setIsSessionRunning] = createSignal(false);

  const { project } = useProjectContext();

  const projectMembers = [
    {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
    },
    ...(project()?.invitedMembers || []),
  ];
  const ownerId = project()?.ownerId;

  const { coopSessionMembers } = useCoopSession();
  const sessionMembers: ProjectMember[] = coopSessionMembers;

  const sortedSession = () =>
    [...sessionMembers].sort((a, b) =>
      a.id === ownerId ? -1 : b.id === ownerId ? 1 : 0,
    );

  return (
    <ModalMenu
      dialogRef={(el) => {
        modal = el;
        props.dialogRef(el);
      }}
      onClose={props.onClose}
    >
      <div class="card bg-base-200 rounded-2xl shadow-2xl overflow-hidden border border-base-300 ring-1 ring-black/5">
        <div class="bg-base-200 py-5 border-b border-base-300">
          <h2 class="text-2xl font-black uppercase tracking-wider text-center text-base-content">
            Коллаборация
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

                          <Show when={user.id === ownerId}>
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
                          {user.id === ownerId ? "Владелец" : "Участник"}
                        </span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div
              class="tooltip tooltip-bottom flex items-center justify-center mt-2"
              data-tip="Добавить участника"
            >
              <button class="btn text-3xl btn-lg text-bold bg-base-100/25 border-base-200 text-center border-2 rounded-lg">
                +
              </button>
            </div>
          </div>

          <div class="flex-1 bg-base-300 flex flex-col relative w-135">
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
                        user.id === ownerId
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
                            <span
                              title={user.username}
                              class="text-lg truncate  font-bold text-base-content"
                            >
                              {user.username}
                            </span>

                            <Show when={user.id === ownerId}>
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
                            {user.id === ownerId ? "Владелец" : "Участник"}
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
              </div>
          </div>
        </div>
      </div>
    </ModalMenu>
  );
};

export default CoopModal;
