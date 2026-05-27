import { userData } from "@/store/user.store";
import { Component, For, Suspense, Show, Accessor } from "solid-js";
import AvatarDefault from "../User/Avatars/AvatarDefault";
import AvatarPicture from "../User/Avatars/AvatarPicture";
import ComponentLoading from "../utils/Loaders/ComponentLoading";
import useSearchMembers from "@/hooks/projects_management/useSearchMembers";

const InviteMembersPanel: Component<{
  setMembers: (members: string[]) => void;
  members: Accessor<string[]>;
}> = (props) => {
  const { setRawQuery, debounced, matchedUsers, rawQuery } = useSearchMembers();

  const addMember = (memberUsername: string) => {
    props.setMembers([...props.members(), memberUsername]);
  };

  const removeMember = (memberUsername: string) => {
    props.setMembers(
      props.members().filter((username) => username !== memberUsername),
    );
  };

  return (
    <details class="collapse bg-base-300 border-base-300 border">
      <summary class="collapse-title font-semibold">
        + Добавить участников
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
            autofocus
            class=" pointer-events-auto"
            onKeyDown={(e) => e.stopPropagation()}
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
          <For each={props.members()}>
            {(memberUsername) => (
              <div>
                <div
                  class="bg-base-100 p-1.5 m-2 rounded-2xl flex justify-between items-center  w-fit cursor-pointer"
                  onclick={(e) => removeMember(memberUsername)}
                >
                  <span class="m-1">{memberUsername}</span>
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
            when={props.members().length < 11}
            fallback=<div class="text-lg text-center hover:bg-base-200">
              Максимальное число участников - 10
            </div>
          >
            <For each={matchedUsers()}>
              {(user) => (
                <Show
                  when={
                    !props.members().includes(user.username) &&
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
                      <AvatarDefault username={user.username} size={6} />
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
  );
};

export default InviteMembersPanel;
