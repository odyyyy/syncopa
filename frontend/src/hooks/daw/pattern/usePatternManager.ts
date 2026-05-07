import { Accessor } from "solid-js";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import {
  PatternType,
  PatternVST,
} from "../../../types/daw.types";
import { useProjectContext } from "@/context/daw/project.context";

const usePatternManager = () => {
  const { tracks, setTracks } = useProjectContext();
  const {
    setCurrentPatternAndTrackId,
    openPianoRoll,
  } = usePianoRollContext();

  const addPatternOnTrack = (
    trackId: string,
    patternId: string = crypto.randomUUID(),
  ) => {
    const track = tracks.find((t) => t.trackId === trackId);
    if (!track) return;
  
    const exists = track.patterns?.some((p) => p.patternId === patternId);
    if (exists) return;
  
    const newPattern: PatternVST = {
      patternId,
      type: "vst",
      pos: 0,
      width: 1,
      title: "Pattern",
      notes: [],
    };
  
    const trackIndex = tracks.indexOf(track);
    
    setTracks(trackIndex, "patterns", (prev) => 
      prev ? [...prev, newPattern] : [newPattern]
    );
  
    return newPattern;
  };

  const editPattern = (e: MouseEvent) => {
    {
      const patternId = (
        (e.target as HTMLElement).closest(".pattern") as HTMLElement
      )?.dataset.patternId;
      const trackId = (
        (e.target as HTMLElement).closest(".track") as HTMLElement
      )?.dataset.trackId;
      if (!patternId) return;
      setCurrentPatternAndTrackId({
        trackId,
        patternId,
      });
      
      openPianoRoll();
    }
  };

  const removePattern = (patternId: string, trackId: string) => {
    if (!patternId || !trackId) return;

    const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
    if (trackIndex === -1) return;
    setTracks(trackIndex, "patterns", (prev: PatternType[] | null) =>
      prev ? prev.filter((p) => p.patternId !== patternId) : null,
    );
  };

  return {
    addPatternOnTrack,
    removePattern,
    editPattern,
  };
};

export default usePatternManager;
