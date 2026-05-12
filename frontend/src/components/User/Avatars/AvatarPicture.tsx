import { Component } from "solid-js";

const AvatarPicture: Component<{ src: string; username: string; size: number }> = (props) => {
  const pixelSize = props.size * 4;
  return (
    <div
      class="avatar rounded-full  hover:scale-105 hover:z-50 transition-all duration-150"
      title={props.username}
    >
      <div class="rounded-full" style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}>
        <img src={props.src} />
      </div>
    </div>
  );
};
export default AvatarPicture;
