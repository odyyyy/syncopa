import { Component, For, Show, Suspense } from "solid-js";
import ComponentLoading from "../utils/Loaders/ComponentLoading";
import useCreateProject from "../../hooks/projects_management/useCreateProject";
import { userData } from "../../store/user";
import AvatarPicture from "../User/Avatars/AvatarPicture";
import AvatarDefault from "../User/Avatars/AvatarDefault";
import useSearchMembers from "../../hooks/projects_management/useInviteMembers";

const ProjectCreatePopup: Component<{
  onCreate: (project: ProjectItemProps) => void;
}> = (props) => {
  const {
    setRawQuery,
    debounced,
    matchedUsers,
    addMember,
    removeMember,
    members,
    rawQuery,
    setMembers,
    clearSearch,
  } = useSearchMembers();
  let dialogRef: HTMLDialogElement | undefined;

  const { handleFieldInput, handleCreateProject, setProjectData, projectData } =
    useCreateProject(props.onCreate, setMembers);

  const openModal = () => {
    dialogRef?.showModal();
  };

  return (
    <div>
      <button
        onclick={openModal}
        class="group relative flex flex-col items-center justify-center bg-base-300 border-2 border-dashed border-zinc-800 hover:border-zinc-500 light:hover:bg-primary/10 hover:bg-zinc-900/60 rounded-lg p-10 transition-all duration-200 cursor-pointer  w-full h-52"
      >
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

          <span class="text-sm font-bold uppercase tracking-widest text-zinc-500  light:group-hover:text-zinc-600 group-hover:text-zinc-300">
            Новый проект
          </span>
        </div>
      </button>
      <dialog ref={dialogRef} class="modal">
        <div class="modal-box flex items-center justify-center flex-col gap-4 bg-base-200">
          <h3 class="text-lg font-bold mb-5 ">Создать новый проект</h3>
          <form
            id="create-project"
            name="create-project"
            onsubmit={(e) => {
              e.preventDefault();
              setProjectData("invitedMembers", members());
              handleCreateProject(members()).then(() => {
                dialogRef?.close();
              });
              clearSearch();
            }}
          >
            <fieldset class="fieldset">
              <label class="input validator w-full">
                <svg
                  class="h-[1em] opacity-80"
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
                  class="h-auto leading-normal grow text-base"
                  placeholder="Название проекта"
                  value={projectData.title}
                  pattern="[A-Za-zА-Яа-я0-9]{3,64}"
                  minlength="3"
                  maxlength="64"
                  name="title"
                  required
                  oninput={handleFieldInput}
                />
              </label>

              <p class="validator-hint text-base ">
                Длина названия должна быть от 3 до 64 символов
              </p>
            </fieldset>

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
                    type="text text-base"
                    placeholder="Никнейм участника"
                    maxlength="64"
                    value={rawQuery()}
                    form="create-project"
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      setRawQuery(value);
                      debounced(value);
                    }}
                  />
                </label>
                <div class="flex flex-wrap">
                  <For each={members()}>
                    {(username) => (
                      <div>
                        <div
                          class="bg-base-100 p-1.5 m-2 rounded-2xl flex justify-between items-center  w-fit cursor-pointer"
                          onclick={(e) => removeMember(username)}
                        >
                          <span class="m-1">{username}</span>
                          <svg
                            class="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 36 36"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m8 22.1a1.4 1.4 0 0 1-2 2l-6-6-6 6.02a1.4 1.4 0 1 1-2-2l6-6.04-6.17-6.22a1.4 1.4 0 1 1 2-2L18 16.1l6.17-6.17a1.4 1.4 0 1 1 2 2L20 18.08Z"
                            />
                            <path fill="none" d="M0 0h36v36H0z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <ul class="list bg-base-300 flex rounded-box shadow-md gap-2">
                <Suspense fallback={<ComponentLoading />}>
                  <Show
                    when={members().length < 11}
                    fallback=<div class="text-lg text-center hover:bg-base-200">
                      Максимальное число участников - 10
                    </div>
                  >
                    <For each={matchedUsers()}>
                      {(user) => (
                        <Show
                          when={
                            !members().includes(user.username) &&
                            user.username !== userData.username
                          }
                        >
                          <li
                            class="list-row cursor-pointer hover:bg-base-200"
                            onclick={() => addMember(user.username)}
                          >
                            <Show when={user.avatar}>
                              <AvatarPicture
                                src={user.avatar}
                                username={user.username}
                                size={6}
                              />
                            </Show>
                            <Show when={!user.avatar}>
                              <AvatarDefault
                                username={user.username}
                                size={6}
                              />
                            </Show>
                            <div>
                              <div>{user.username}</div>
                            </div>
                          </li>
                        </Show>
                      )}
                    </For>
                  </Show>
                </Suspense>
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
