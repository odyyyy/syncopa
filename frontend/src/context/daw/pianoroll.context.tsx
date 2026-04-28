import {
  createContext,
  ParentComponent,
  createSignal,
  useContext,
  onMount,
} from "solid-js";
import { PatternAndTrack, PianoRollContextType } from "../../types/daw.types";
import { createStore } from "solid-js/store";
import { useProjectContext } from "./project.context";

export const PianoRollContext = createContext<PianoRollContextType>();

export const PianoRollProvider: ParentComponent = (props) => {
  const [currentPatternAndTrackId, setCurrentPatternAndTrackId] =
    createStore<PatternAndTrack>({ patternId: "", trackId: "" });
  const [currentPatternWidthInTacts, setCurrentPatternWidthInTacts] =
    createSignal(0);
  const [isPianoRollOpen, setIsPianoRollOpen] = createSignal(false);
  const [pianoRollHeight, setPianoRollHeight] = createSignal(500);

  const openPianoRoll = () => setIsPianoRollOpen(true);
  const closePianoRoll = () => setIsPianoRollOpen(false);
  
  const { tracks } = useProjectContext();
  const { patternId } = currentPatternAndTrackId;
  onMount(() => {
    const pattern = tracks
      .flatMap(t => t.patterns || [])
      .find(p => p.patternId === patternId);
    
    setCurrentPatternWidthInTacts(() => pattern?.width ?? 1);
  });
  
  return (
    <PianoRollContext.Provider
      value={{
        isPianoRollOpen,setIsPianoRollOpen,
        openPianoRoll,
        currentPatternAndTrackId,
        setCurrentPatternAndTrackId,
        closePianoRoll,
        currentPatternWidthInTacts,
        setCurrentPatternWidthInTacts,
        pianoRollHeight,
        setPianoRollHeight,
      }}
    >
      {props.children}
    </PianoRollContext.Provider>
  );
};

export const usePianoRollContext = () => {
  const context = useContext(PianoRollContext);
  if (!context) {
    throw new Error("PianoRollContext не найден");
  }
  return context;
};
