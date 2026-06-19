import { useProjectContext } from "@/context/daw/project.context";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { usePianoRollContext } from "@/context/daw/pianoroll.context";
import { Note, PatternType, PatternVST } from "../../../types/daw.types";

const SUBDIV = 16;

const useNoteManager = () => {
  const { tracks, setTracks } = useProjectContext();
  const {  beatNumber } = useTimelineContext();
  const { currentPatternWidthInTacts } = usePianoRollContext();

  const totalBeats = () => currentPatternWidthInTacts() * beatNumber();

  const snapStep = () => 1 / SUBDIV;

  const snap = (value: number) => {
    const step = snapStep();
    return Math.round(value / step) * step;
  };

  const findIndexes = (trackId: string, patternId: string, noteId?: string) => {
    const tIndex = tracks.findIndex((t) => t.trackId === trackId);

    if (tIndex === -1) return null;

    const track = tracks[tIndex];

    if (!track?.patterns) return null;

    const pIndex = track.patterns.findIndex((p) => p.patternId === patternId);

    if (pIndex === -1) return null;

    const pattern = track.patterns[pIndex];

    if (!pattern || pattern.type !== "vst") return null;

    if (!noteId)
      return {
        tIndex,
        pIndex,
        nIndex: -1,
      };

    const nIndex =
      (pattern as PatternVST).notes?.findIndex((n) => n.noteId === noteId) ??
      -1;

    if (nIndex === -1) return null;

    return {
      tIndex,
      pIndex,
      nIndex,
    };
  };

  const calcNotePos = (
    clickXRelativeToGrid: number,
    totalPatternWidthPx: number,
  ): number => {
    const rawPos = (clickXRelativeToGrid / totalPatternWidthPx) * totalBeats();

    return snap(Math.max(0, rawPos));
  };

  const addNote = (note: Note, trackId: string, patternId: string) => {
    const indexes = findIndexes(trackId, patternId);

    if (!indexes) return;

    const { tIndex, pIndex } = indexes;

    const snappedNote: Note = {
      ...note,
      pos: snap(note.pos),
    };

    setTracks(
      tIndex,
      "patterns",
      pIndex,
      "notes" as any,
      (prev: Note[] = []) => [...prev, snappedNote],
    );
  };

  const removeNote = (trackId: string, patternId: string, noteId: string) => {
    const indexes = findIndexes(trackId, patternId, noteId);

    if (!indexes) return;

    const { tIndex, pIndex, nIndex } = indexes;

    setTracks(tIndex, "patterns", pIndex, (prevPattern: PatternType) => {
      if (prevPattern.type !== "vst") return prevPattern;

      const notes = (prevPattern as PatternVST).notes ?? [];

      return {
        ...prevPattern,
        notes: [...notes.slice(0, nIndex), ...notes.slice(nIndex + 1)],
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

    const { tIndex, pIndex, nIndex } = indexes;

    setTracks(tIndex, "patterns", pIndex, (prevPattern: PatternType) => {
      if (prevPattern.type !== "vst") return prevPattern;

      const notes = (prevPattern as PatternVST).notes ?? [];

      const updatedNotes = notes.map((n, i) =>
        i === nIndex
          ? {
              ...n,
              pos: snap(pos),
              duration,
              note,
            }
          : n,
      );

      return {
        ...prevPattern,
        notes: updatedNotes,
      };
    });
  };

  return {
    findIndexes,
    removeNote,
    addNote,
    updateTransformedNote,
    calcNotePos,
    snapStep,
    totalBeats,
  };
};

export default useNoteManager;
