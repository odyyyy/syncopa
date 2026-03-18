import { useProjectContext } from "./context/useProjectContext";
import { useTracksContext } from "./context/useTracksContext";
import usePianoRoll from "./usePianoRoll";
import { Note as NoteType, PatternVST } from "../../types/daw.types";

export default function useNoteTransform() {
  const { tactWidth, beatNumber } = useTracksContext();
  const { tracks, setTracks } = useProjectContext();
  const { noteNames: NOTES } = usePianoRoll();

  let mode: "move" | "resizeL" | "resizeR" | null = null;
  let startX = 0,
    startY = 0,
    startPos = 0,
    startDur = 0,
    startNoteIdx = 0;
  let trackId!: string, patternId!: string, noteId!: string;
  let patternWidth = 0;

  const STEP = 1 / 16;
  const pxPerStep = () => (tactWidth() * 3) / (beatNumber() * 16);
  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  const noteToIndex = (note: string) => {
    const m = note.match(/([A-G]#?)(\d)/);
    if (!m) return 0;
    const idx = NOTES.indexOf(m[1]!);
    return idx === -1 ? 0 : idx + Number(m[2]!) * 12;
  };

  const indexToNote = (i: number) => {
    i = Math.max(0, i);
    const octave = Math.floor(i / 12);
    const note = NOTES[i % 12] ?? "C";
    return `${note}${octave}`;
  };

  const findIndexes = () => {
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

  const transformNote = (
    e: MouseEvent,
    ctx: {
      trackId: string;
      patternId: string;
      note: NoteType & { noteId: string };
      patternWidth: number;
    },
  ) => {
    if (!ctx.trackId || !ctx.patternId) return;

    e.preventDefault();
    e.stopPropagation();

    trackId = ctx.trackId;
    patternId = ctx.patternId;
    noteId = ctx.note.noteId;
    patternWidth = ctx.patternWidth;

    startX = e.clientX;
    startY = e.clientY;
    startPos = ctx.note.pos;
    startDur = ctx.note.duration;
    startNoteIdx = noteToIndex(ctx.note.note);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const edge = 6;

    if (e.clientX - rect.left < edge) mode = "resizeL";
    else if (rect.right - e.clientX < edge) mode = "resizeR";
    else mode = "move";

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onMove = (e: MouseEvent) => {
    const indexes = findIndexes();
    if (!indexes) return;
    const { tIndex, pIndex, nIndex } = indexes;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const stepsX = Math.round(dx / pxPerStep() / (STEP * beatNumber() * 3));
    const stepsY = Math.round(dy / 24);

    const updatedTracks = tracks.map((track, ti) => {
      if (ti !== tIndex) return track;
      return {
        ...track,
        patterns:
          track.patterns?.map((pattern) => {
            if (pattern.patternId !== patternId || pattern.type !== "vst")
              return pattern;
            const vstPattern = pattern as PatternVST;

            const updatedNotes = vstPattern.notes?.map((note, ni) => {
              if (note.noteId !== noteId) return note;

              let newPos = startPos;
              let newDur = startDur;
              let newNoteIdx = startNoteIdx;

              if (mode === "move") {
                newPos = clamp(
                  startPos + stepsX / 20,
                  1,
                  patternWidth - startDur + 1,
                );
                newNoteIdx = clamp(startNoteIdx - stepsY, 0, NOTES.length * 8);
              } else if (mode === "resizeR") {
                const maxDur = patternWidth - startPos + 1;
                newDur = clamp(
                  Math.round((startDur + stepsX * STEP) / STEP) * STEP,
                  STEP,
                  maxDur,
                );
              } else if (mode === "resizeL") {
                newPos = clamp(
                  startPos + stepsX * STEP,
                  1,
                  startPos + startDur - STEP,
                );
                newDur = clamp(
                  startDur - stepsX * STEP,
                  STEP,
                  startDur + startPos - newPos,
                );
              }
              return {
                ...note,
                pos: newPos,
                duration: newDur,
                note: indexToNote(newNoteIdx),
              };
            });

            return { ...vstPattern, notes: updatedNotes ?? null };
          }) ?? [],
      };
    });

    setTracks(updatedTracks);
  };

  const onUp = () => {
    mode = null;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  };

  return { transformNote };
}
