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
    const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
    if (trackIndex === -1) return;

    const pattern: PatternVST = {
      patternId,
      type: "vst",
      pos: 0,
      width: 1,
      title: "Pattern",
      notes: [],
    };

    setTracks(trackIndex, "patterns", (prev: PatternType[] | null) =>
      prev ? [...prev, pattern] : [pattern],
    );

    return pattern;
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
