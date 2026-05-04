import { Component, createSignal, For, Show } from "solid-js";
import ModalMenu from "../ModalMenu";
import AvatarDefault from "../../User/Avatars/AvatarDefault";
import AvatarPicture from "../../User/Avatars/AvatarPicture";
import { useProjectContext } from "@/context/daw/project.context";
import { userData } from "../../../store/user";
import { useCoopContext } from "../../../context/coop/coopsession.context";
import InviteMembersPanel from "@/components/ProjectsManagement/InviteMembersPanel";
import useSearchMembers from "@/hooks/projects_management/useSearchMembers";
import { useProjectsApi } from "@/api/projects-management.api";
import toast from "solid-toast";

type CoopModalProps = {
  dialogRef: (el: HTMLDialogElement) => void;
  onClose?: () => void;
};

const CoopModal: Component<CoopModalProps> = (props) => {
  const { project } = useProjectContext();
  const [isInvitePanelOpen, setIsInvitePanelOpen] = createSignal(false);
  const { members, setMembers } = useSearchMembers();
  const { coopSessionMembers } = useCoopContext();
  const { inviteMembers } = useProjectsApi();

  const inviteMembersInProject = async (membersUsernamesToInvite: string[]) => {
    if (!membersUsernamesToInvite.length) return;
    const res = await inviteMembers(
      project()?.projectId!,
      membersUsernamesToInvite,
    );
    if (res.type === "success") toast.success("Участники приглашены");
    else toast.error("Ошибка приглашения");
  };

  const ownerId = project()?.ownerId;

  const projectMembers = () => [
    { id: userData.id, username: userData.username, avatar: userData.avatar },
    ...(project()?.members || []),
  ];

  const sortMembers = (members: ProjectMember[]) =>
    [...members].sort((a, b) =>
      a.id === ownerId ? -1 : b.id === ownerId ? 1 : 0,
    );

  return (
    <ModalMenu dialogRef={props.dialogRef} onClose={props.onClose}>
      <div class="w-245 h-150 rounded-3xl overflow-hidden shadow-2xl bg-linear-to-br from-base-200 via-base-300 to-base-200 border border-base-300 flex">
        <div class="w-85 flex flex-col border-r border-base-300/60 backdrop-blur-xl bg-base-200/60">
          <div class="p-6 border-b border-base-300/50">
            <h2 class="text-xl font-black opacity-80 tracking-normal">
              Команда проекта
            </h2>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <For each={sortMembers(projectMembers())}>
              {(user) => (
                <div class="flex items-center gap-3 p-3 rounded-xl bg-base-100/60 hover:bg-base-100 transition-all cursor-pointer">
                  <Show
                    when={user.avatar}
                    fallback={
                      <AvatarDefault username={user.username} size={9} />
                    }
                  >
                    <AvatarPicture
                      src={user.avatar!}
                      username={user.username}
                      size={9}
                    />
                  </Show>
                  <div class="flex flex-col">
                    <div class="flex items-center gap-1">
                      <span class="font-semibold text-sm">{user.username}</span>
                      <Show when={user.id === ownerId}>
                        <span class="text-warning">
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
                    <span class="text-[10px] opacity-40 uppercase">
                      {user.id === ownerId ? "Владелец" : "Участник"}
                    </span>
                  </div>
                </div>
              )}
            </For>
          </div>

          <div class="p-4 border-t border-base-300/50">
            <Show when={!isInvitePanelOpen()}>
              <button
                class="btn btn-outline w-full rounded-xl"
                onClick={() => setIsInvitePanelOpen(true)}
              >
                + Пригласить участников
              </button>
            </Show>

            <Show when={isInvitePanelOpen()}>
              <form
                class="flex flex-col gap-3 text-center"
                onsubmit={(e) => {
                  e.preventDefault();
                  inviteMembersInProject(members());
                }}
              >
                <InviteMembersPanel setMembers={setMembers} members={members} />

                <div class="flex gap-2">
                  <button
                    type="button"
                    class="btn btn-ghost flex-1"
                    onClick={() => setIsInvitePanelOpen(false)}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary flex-1"
                    disabled={members().length === 0}
                  >
                    Пригласить
                  </button>
                </div>
              </form>
            </Show>
          </div>
        </div>

        <div class="flex-1 flex flex-col bg-base-100/40 backdrop-blur-xl">
          <div class="p-5 border-b border-base-300/50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-success animate-pulse"></div>
              <span class="font-bold text-sm uppercase tracking-wide">
                Текущая сессия
              </span>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <For each={sortMembers(coopSessionMembers)}>
              {(user) => (
                <div class={`flex items-center justify-between p-4 rounded-2xl cursor-pointer bg-base-200/70 hover:bg-base-200 transition-all ${user.id === ownerId ? 'bg-base-content/10 hover:bg-base-content/15' : 'bg-base-200/70 hover:bg-base-200'}`}>
                  <div class="flex items-center gap-4">
                    <Show
                      when={user.avatar}
                      fallback={
                        <AvatarDefault username={user.username} size={12} />
                      }
                    >
                      <AvatarPicture
                        src={user.avatar!}
                        username={user.username}
                        size={12}
                      />
                    </Show>
                    <div class="flex flex-col">
                      <span class="font-semibold text-base">
                        {user.username}
                      </span>
                      <span class="text-xs opacity-50">
                        {user.id === ownerId ? "Владелец" : "Участник"}
                      </span>
                    </div>
                  </div>
                  <div class="w-2 h-2 bg-success rounded-full shadow-lg"></div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </ModalMenu>
  );
};

export default CoopModal;
