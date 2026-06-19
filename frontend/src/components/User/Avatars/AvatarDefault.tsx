import { Component } from "solid-js";

const AvatarDefault: Component<{ username: string; size: number }> = (
  props,
) => {
  const pixelSize = props.size * 4;
  return (
    <div
      class="avatar avatar-placeholder hover:scale-105 hover:z-50 transition-all duration-150"
      title={props.username}
    >
      <div
        class={`bg-neutral text-neutral-content rounded-full`}
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      >
        <span style={{ "font-size": `${props.size * 1.25}px` }}>
          {props.username.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default AvatarDefault;
