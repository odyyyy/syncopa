import { createContext, onMount, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import CoopCursor from "../../components/DAW/Coop/CoopCursor";
import {
  CoopSessionContextType,
  CoopOperationsHandlers,
} from "../../types/coop.types";
import setupCoopConnectionsAndHandleEvents from "../../coop/coopConnections";
import usePatternManage from "../../hooks/daw/pattern/usePatternManage";
import useTracksManager from "../../hooks/daw/useTracksManager";
import useNoteManage from "../../hooks/daw/pianoroll/useNoteManage";
import useUpdatePatternPosAndWidth from "../../hooks/daw/pattern/updatePatternPosAndWidth";
import { usePresetsContext } from "../daw/presets.context";

export const CoopSessionContext = createContext<CoopSessionContextType>();

export const CoopSessionProvider: ParentComponent = (props) => {
  const [coopSessionMembers, setCoopSessionMembers] = createStore<
    ProjectMember[]
  >([]);

  const patternManager = usePatternManage();
  const patternTransform = useUpdatePatternPosAndWidth();
  const tracksManager = useTracksManager();
  const noteManager = useNoteManage();
  const { updatePreset } = usePresetsContext();

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
