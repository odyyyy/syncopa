import { PatternType, PatternVST } from "../../../types/daw.types";
import { useProjectContext } from "../context/useProjectContext";

const usePatternManage = () => {
  const { tracks, setTracks } = useProjectContext();

  const addPatternOnTrack = (trackId: string) => {
    const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
    if (trackIndex === -1) return;

    const pattern: PatternVST = {
      patternId: crypto.randomUUID(),
      type: "vst",
      pos: 0,
      width: 1,
      instrumentId: null,
      title: "Pattern",
      notes: [],
      ref: null,
    };

    setTracks(trackIndex, "patterns", (prev: PatternType[] | null) =>
      prev ? [...prev, pattern] : [pattern],
    );
  };

  return {
    addPatternOnTrack,
  };
};

export default usePatternManage;
