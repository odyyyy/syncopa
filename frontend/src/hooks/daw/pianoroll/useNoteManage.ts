import { useProjectContext } from "../context/useProjectContext";
import { Note, PatternType, PatternVST } from "../../../types/daw.types";
const useNoteManage = () => {
  const { tracks, setTracks } = useProjectContext();

  const findIndexes = (trackId: string, patternId: string, noteId: string) => {
    const tIndex = tracks.findIndex((t) => t.trackId === trackId);
    if (tIndex === -1) return null;
    const track = tracks[tIndex];
    if (!track?.patterns) return null;
    const pIndex = track.patterns.findIndex((p) => p.patternId === patternId);
    if (pIndex === -1) return null;
    const pattern = track.patterns[pIndex];
    if (!pattern || pattern.type !== "vst" || !(pattern as PatternVST).notes)
      return null;
    const nIndex = (pattern as PatternVST).notes
      ? (pattern as PatternVST).notes!.findIndex((n) => n.noteId === noteId)
      : -1;
    if (nIndex === -1) return null;
    return { tIndex, pIndex, nIndex };
  };

  const addNote = (note: Note, trackId: string, patternId: string) => {
    setTracks(
      (track) => track.trackId === trackId,
      "patterns",
      (patterns) =>
        patterns?.map((pattern) => {
          if (pattern.patternId === patternId && pattern.type === "vst") {
            return {
              ...pattern,
              notes: [...(pattern.notes || []), note],
            };
          }
          return pattern;
        }) ?? null,
    );
  };

  const removeNote = (trackId: string, patternId: string, noteId: string) => {
    const indexes = findIndexes(trackId, patternId, noteId);
    if (!indexes) return;

    const { tIndex, pIndex } = indexes;

    const isPatternVST = (pattern: PatternType): pattern is PatternVST => {
      return pattern.type === "vst";
    };
    setTracks(tIndex, "patterns", pIndex, (prevPattern: PatternType) => {
      if (!isPatternVST(prevPattern)) {
        return prevPattern;
      }
      return {
        ...prevPattern,
        notes: prevPattern.notes?.filter((note) => note.noteId != noteId),
      };
    });
  };

  const updateTransformedNote = (
    pos: number,
    duration: number,
    note: string,
    trackId: string,
    patternId: string,
    noteId: string,
  ) => {
    const indexes = findIndexes(trackId, patternId, noteId);
    if (!indexes) return;

    const { tIndex, pIndex } = indexes;
    
    setTracks(tIndex, "patterns", pIndex, "notes" as any, (prev: Note[]) =>
      prev.map((n) =>
        n.noteId === noteId ? { ...n, pos, duration, note } : n,
      ),
    );
  };

  return {
    findIndexes,
    removeNote,
    addNote,
    updateTransformedNote,
  };
};
export default useNoteManage;
