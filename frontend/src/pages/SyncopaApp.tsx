import { Component, onCleanup, onMount } from "solid-js";
import UpperControlPanel from "../components/DAW/Base/UpperControlPanel";
import LowerControlPanel from "../components/DAW/Base/LowerControlPanel";
import MainDawTrackPanel from "../components/DAW/Base/MainDawTrackPanel";
import { ProjectProvider } from "../context/daw/project.context";
import { PlayerProvider } from "../context/daw/player.context";
import { ContextMenuProvider } from "../context/daw/contextmenu.context";

const SyncopaApp: Component = () => {
  const onBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
    return "";
  };

  onMount(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    onCleanup(() => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    });
  });

  return (
    <div class="flex flex-col h-screen">
      <ProjectProvider>
        
        <PlayerProvider>
          <UpperControlPanel />
          
          <ContextMenuProvider>
            <MainDawTrackPanel />
          </ContextMenuProvider>
          
        </PlayerProvider>
        
        <LowerControlPanel />
      </ProjectProvider>
    </div>
  );
};

export default SyncopaApp;
