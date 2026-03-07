import { Component, onCleanup, onMount } from "solid-js";
import UpperControlPanel from "../components/DAW/UpperControlPanel";
import LowerControlPanel from "../components/DAW/LowerControlPanel";
import MainDawTrackPanel from "../components/DAW/MainDawTrackPanel";
import { ProjectProvider } from "../context/daw";

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
        <UpperControlPanel />
        <MainDawTrackPanel />
        <LowerControlPanel />
      </ProjectProvider>
    </div>
  );
};

export default SyncopaApp;
