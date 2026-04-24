import { useTimelineContext } from "@/context/daw/timeline.context";
import usePianoRoll from "./usePianoRoll";
import { Note as NoteType } from "../../../types/daw.types";
import useNoteManager from "./useNoteManager";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";

export default function useNoteTransform() {
  const { tactWidth, beatNumber } = useTimelineContext();
  const { noteNames: NOTES } = usePianoRoll();

  let mode: "move" | "resizeL" | "resizeR" | null = null;
  let startX = 0,
    startY = 0,
    startPos = 0,
    startDur = 0,
    startNoteIdx = 0,
    currentPos = 0,
    currentDur = 0,
    currentNoteIdx = 0;
  
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
    
    currentPos = startPos;
    currentDur = startDur;
    currentNoteIdx = startNoteIdx;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const edge = 6;

    if (e.clientX - rect.left < edge) mode = "resizeL";
    else if (rect.right - e.clientX < edge) mode = "resizeR";
    else mode = "move";

    window.addEventListener("mousemove", onNoteMove);
    window.addEventListener("mouseup", onNoteUp);
  };

  const { sendChangeEvent } = useSendChangeEvent();
  const { updateTransformedNote } = useNoteManager();
  const onNoteMove = (e: MouseEvent) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const stepsX = Math.round(dx / pxPerStep() / (STEP * beatNumber() * 3));
    const stepsY = Math.round(dy / 24);

    let newPos = startPos;
    let newDur = startDur;
    let newNoteIdx = startNoteIdx;

    if (mode === "move") {
      newPos = clamp(startPos + stepsX / 20, 1, patternWidth - startDur + 1);
      newNoteIdx = clamp(startNoteIdx - stepsY, 0, NOTES.length * 8);
    } else if (mode === "resizeR") {
      const maxDur = patternWidth - startPos + 1;
      newDur = clamp(
        Math.round((startDur + stepsX * STEP) / STEP) * STEP,
        STEP,
        maxDur,
      );
    } else if (mode === "resizeL") {
      newPos = clamp(startPos + stepsX * STEP, 1, startPos + startDur - STEP);
      newDur = clamp(
        startDur - stepsX * STEP,
        STEP,
        startDur + startPos - newPos,
      );
    }

    const newNote = indexToNote(newNoteIdx);

    updateTransformedNote(newPos, newDur, newNote, trackId, patternId, noteId);
    currentPos = newPos;
    currentDur = newDur;
    currentNoteIdx = newNoteIdx;
  };

  const onNoteUp = () => {
    if (mode === "move" || mode === "resizeL" || mode === "resizeR") {
      sendChangeEvent(SyncOperation.TRANSFORM, Target.NOTE, {
        trackId,
        patternId,
        noteId,
        note: {
          pos: currentPos,
          duration: currentDur,
          note: indexToNote(currentNoteIdx),
        },
      });
    }

    mode = null;
    window.removeEventListener("mousemove", onNoteMove);
    window.removeEventListener("mouseup", onNoteUp);
  };

  return { transformNote };
}
