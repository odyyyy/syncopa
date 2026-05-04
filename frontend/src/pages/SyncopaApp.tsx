import { Component, onCleanup, onMount } from "solid-js";
import UpperControlPanel from "../components/DAW/Base/UpperControlPanel";
import LowerControlPanel from "../components/DAW/Base/LowerControlPanel";
import MainDawWorkspace from "../components/DAW/Base/MainDawWorkspace";
import { ProjectProvider } from "../context/daw/project.context";
import { PlayerProvider } from "../context/daw/player.context";
import { ContextMenuProvider } from "../context/daw/contextmenu.context";
import { TimelineProvider } from "../context/daw/timeline.context";
import { PianoRollProvider } from "../context/daw/pianoroll.context";
import * as Tone from "tone";
import { PresetsProvider } from "../context/daw/presets.context";
import { CoopSessionProvider } from "../context/coop/coopsession.context";
import { VCSProvider } from "@/context/vcs/vcs.context";

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
        if (Tone.getContext().state !== "running") {
          await Tone.start();
        }
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
        <TimelineProvider>
          <PlayerProvider>
            <ContextMenuProvider>
              <PianoRollProvider>
                <PresetsProvider>
                  <CoopSessionProvider>
                    <VCSProvider>
                      <UpperControlPanel />
                      <MainDawWorkspace />
                      <LowerControlPanel />
                    </VCSProvider>
                  </CoopSessionProvider>
                </PresetsProvider>
              </PianoRollProvider>
            </ContextMenuProvider>
          </PlayerProvider>
        </TimelineProvider>
      </ProjectProvider>
    </div>
  );
};

export default SyncopaApp;
