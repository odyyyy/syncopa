import { Component } from "solid-js";

const AvatarPicture: Component<{ src: string; username: string; size: number }> = (props) => {
  return (
    <div
      class="avatar rounded-full  hover:scale-105 hover:z-50 transition-all duration-150"
      title={props.username}
    >
      <div class={` w-${props.size} h-${props.size} rounded-full`}>
        <img src={props.src} />
      </div>
    </div>
  );
};
export default AvatarPicture;
