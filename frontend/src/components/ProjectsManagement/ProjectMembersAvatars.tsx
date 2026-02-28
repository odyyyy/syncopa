import { Component, For, Show } from "solid-js";

const ProjectMembersAvatars: Component<{ members: MemberAvatarProps[] }> = (
  props,
) => {
  const membersToShow = 3;
  const restMemberNumber = props.members.length - membersToShow;
  return (
    <div class="avatar-group  -space-x-6  p-0.5 -mr-2">
      <For each={props.members.slice(0, membersToShow)}>
        {(member, index) => (
          <>
            <Show when={member.avatar && index() < membersToShow}>
              <div class="avatar">
                <div class="w-12">
                  <img src={member.avatar} />
                </div>
              </div>
            </Show>
            <Show when={!member.avatar && index() < membersToShow}>
              <div
                class="avatar avatar-placeholder hover:scale-105 hover:z-50 transition-all duration-150"
                title={member.username}
              >
                <div class="bg-neutral text-neutral-content w-12 rounded-full">
                  <span>{member.username.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </Show>
          </>
        )}
      </For>
      <Show when={restMemberNumber > 0}>
        <div class="avatar avatar-placeholder">
          <div class="bg-neutral text-neutral-content w-12">
            <span>+{restMemberNumber}</span>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ProjectMembersAvatars;
