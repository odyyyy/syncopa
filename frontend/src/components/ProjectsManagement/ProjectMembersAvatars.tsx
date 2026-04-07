import { Component, For, Show } from "solid-js";
import AvatarPicture from "../User/Avatars/AvatarPicture";
import AvatarDefault from "../User/Avatars/AvatarDefault";

const ProjectMembersAvatars: Component<{ members: ProjectMember[] }> = (
  props,
) => {
  const membersToShow = 3;
  const restMemberNumber = props.members.length - membersToShow;
  return (
    <div
      class="avatar-group  -space-x-6  p-0.5 -mr-2 cursor-default"
      onclick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <For each={props.members.slice(0, membersToShow)}>
        {(member, index) => (
          <>
            <Show when={member.avatar && index() < membersToShow}>
              <AvatarPicture
                src={member.avatar!}
                username={member.username}
                size={12}
              />
            </Show>
            <Show when={!member.avatar && index() < membersToShow}>
              <AvatarDefault username={member.username} size={12} />
            </Show>
          </>
        )}
      </For>
      <Show when={restMemberNumber > 0}>
        <div class="avatar avatar-placeholder  hover:scale-105 hover:z-50 transition-all duration-150">
          <div class="bg-neutral text-neutral-content w-12">
            <span>+{restMemberNumber}</span>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ProjectMembersAvatars;
