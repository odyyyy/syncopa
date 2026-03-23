import { Component, onCleanup, onMount } from "solid-js";
import UpperControlPanel from "../components/DAW/Base/UpperControlPanel";
import LowerControlPanel from "../components/DAW/Base/LowerControlPanel";
import MainDawTrackPanel from "../components/DAW/Base/MainDawTrackPanel";
import { ProjectProvider } from "../context/daw/project.context";
import { PlayerProvider } from "../context/daw/player.context";
import { ContextMenuProvider } from "../context/daw/contextmenu.context";
import { TracksProvider } from "../context/daw/tracks.context";
import { PianoRollProvider } from "../context/daw/pianoroll.context";
import * as Tone from "tone";

const SyncopaApp: Component = () => {
  const onBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
    return "";
  };

  onMount(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener(
      "click",
      async () => {
        await Tone.start();
      },
      { once: true },
    );
    onCleanup(() => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    });
  });

  return (
    <div class="flex flex-col h-screen">
      <ProjectProvider>
        <TracksProvider>
          <PlayerProvider>
            <UpperControlPanel />

            <ContextMenuProvider>
              <PianoRollProvider>
                <MainDawTrackPanel />
              </PianoRollProvider>
            </ContextMenuProvider>
          </PlayerProvider>
        </TracksProvider>

        <LowerControlPanel />
      </ProjectProvider>
    </div>
  );
};

export default SyncopaApp;
