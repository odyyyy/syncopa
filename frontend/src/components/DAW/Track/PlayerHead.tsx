import { Component } from "solid-js";
import useMainDawTrackPanel from "../../../hooks/daw/useMainDawTrackPanel";

const PlayerHead: Component = () => {
  const { finalPlayerHeadPos } = useMainDawTrackPanel();
  
  return (
    <span
      class="absolute top-0 bottom-0 w-1 bg-base-content/35 z-50 pointer-events-none"
      style={{ left: `${finalPlayerHeadPos()}px` }}
    ></span>
  );
};

export default PlayerHead;
