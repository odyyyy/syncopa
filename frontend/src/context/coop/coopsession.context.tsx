import { createContext, onMount, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import CoopCursor from "../../components/DAW/Coop/CoopCursor";
import {
  CoopSessionContextType,
  CoopOperationsHandlers,
} from "../../types/coop.types";
import setupCoopConnectionsAndHandleEvents from "../../coop/coopConnections";
import usePatternManager from "../../hooks/daw/pattern/usePatternManager";
import useTracksManager from "../../hooks/daw/useTracksManager";
import useNoteManager from "../../hooks/daw/pianoroll/useNoteManager";
import useUpdatePatternPosAndWidth from "../../hooks/daw/pattern/updatePatternPosAndWidth";
import { usePresetsContext } from "../daw/presets.context";
import useEffectsManager from "@/hooks/daw/effect/useEffectsManager";

export const CoopSessionContext = createContext<CoopSessionContextType>();

export const CoopSessionProvider: ParentComponent = (props) => {
  const [coopSessionMembers, setCoopSessionMembers] = createStore<
    ProjectMember[]
  >([]);

  const patternManager = usePatternManager();
  const patternTransform = useUpdatePatternPosAndWidth();
  const tracksManager = useTracksManager();
  const noteManager = useNoteManager();
  const { updatePreset } = usePresetsContext();
  const effectManager = useEffectsManager();

  const coopOperationsHandlers: CoopOperationsHandlers = {
    addTrack: tracksManager.addTrackInStoreAndLoadDefaultPreset,
    removeTrack: tracksManager.removeTrackFromStore,
    addPattern: patternManager.addPatternOnTrack,
    removePattern: patternManager.removePattern,
    transformPattern: patternTransform.updatePatternPosAndWidth,
    addNote: noteManager.addNote,
    removeNote: noteManager.removeNote,
    transformNote: noteManager.updateTransformedNote,
    updatePreset: updatePreset,
    updateTrackVolume: tracksManager.handleTrackVolumeChange,
    applyEffectToPattern: effectManager.applyEffectToPattern,
    removeEffectFromPattern: effectManager.removeEffectFromPattern,
  };

  const websocketConnection = setupCoopConnectionsAndHandleEvents(
    setCoopSessionMembers,
    coopOperationsHandlers,
  );

  onMount(() => {
    const handlePopState = (e: PopStateEvent) => {
      websocketConnection.close();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  });

  return (
    <CoopSessionContext.Provider
      value={{
        coopSessionMembers,
        setCoopSessionMembers,
        websocketConnection,
      }}
    >
      {/*<CoopCursor />*/}
      {props.children}
    </CoopSessionContext.Provider>
  );
};

export const useCoopSession = () => {
  const context = useContext(CoopSessionContext);
  if (!context) {
    throw new Error("CoopSessionContext не найден");
  }
  return context;
};
