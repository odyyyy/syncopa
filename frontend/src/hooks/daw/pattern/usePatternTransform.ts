import { createSignal, createEffect, createMemo, Accessor } from "solid-js";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { Note, PatternType, PatternVST } from "../../../types/daw.types";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";
import useUpdatePatternPosAndWidth from "./updatePatternPosAndWidth";

const truncateNotes = (notes: Note[], maxPos: number): Note[] => {
  return notes.reduce((acc: Note[], note) => {
    const startPos = note.pos - 1;
    const endPos = startPos + note.duration;

    if (startPos >= maxPos) return acc;

    if (endPos > maxPos) {
      acc.push({ ...note, duration: Math.max(0.1, maxPos - startPos) });
    } else {
      acc.push(note);
    }
    return acc;
  }, []);
};

const usePatternTransform = (pattern: Accessor<PatternType>, trackId: string) => {
  const { tactWidth, tactElementsNumber, beatNumber } = useTimelineContext();
  const { sendChangeEvent } = useSendChangeEvent();
  const { updatePatternPosAndWidth } = useUpdatePatternPosAndWidth();

  const [isGrabbing, setIsGrabbing] = createSignal(false);
  const [isResizeLeft, setIsResizeLeft] = createSignal(false);
  const [isResizeRight, setIsResizeRight] = createSignal(false);

  const [patternPosInTacts, setPatternPosInTacts] = createSignal(pattern().pos);
  const [patternWidthInTacts, setPatternWidthInTacts] = createSignal(pattern().width);

  createEffect(() => {
    const p = pattern();
    setPatternPosInTacts(p.pos);
    setPatternWidthInTacts(p.width);
  });

  const patternPos = createMemo(() => patternPosInTacts() * tactWidth());
  const patternWidth = createMemo(() => patternWidthInTacts() * tactWidth());

  const handlePatternGlobalMouseMove = (e: MouseEvent) => {
    const deltaTacts = e.movementX / tactWidth();

    if (isGrabbing()) {
      setPatternPosInTacts((prev) => {
        const next = Math.max(0, prev + deltaTacts);
        const maxPos = tactElementsNumber() - patternWidthInTacts();
        return Math.min(next, maxPos);
      });
    }

    if (isResizeRight()) {
      setPatternWidthInTacts((prev) => {
        const minWidth = 1 / beatNumber();
        const maxWidth = tactElementsNumber() - patternPosInTacts();
        return Math.min(maxWidth, Math.max(minWidth, prev + deltaTacts));
      });
    }

    if (isResizeLeft()) {
      const currentPos = patternPosInTacts();
      if (currentPos + deltaTacts < 0) return;

      setPatternWidthInTacts((prev) => {
        const minWidth = 1 / beatNumber();
        return Math.max(minWidth, prev - deltaTacts);
      });
      setPatternPosInTacts((prev) => prev + deltaTacts);
    }
  };

  const handlePatternGlobalMouseUp = () => {
    if (isGrabbing() || isResizeLeft() || isResizeRight()) {
      const step = 1 / beatNumber() / 4;
      const finalPos = Math.round(patternPosInTacts() / step) * step;
      const finalWidth = Math.round(patternWidthInTacts() / step) * step;

      let updatedNotes: Note[] = [];
      const currentPattern = pattern();

      if (currentPattern.type === "vst") {
        const rawNotes = (currentPattern as PatternVST).notes || [];
        const maxNotePos = finalWidth * beatNumber();
        updatedNotes = currentPattern.width > finalWidth 
          ? truncateNotes(rawNotes, maxNotePos) 
          : rawNotes;
      }

      updatePatternPosAndWidth(
        currentPattern.patternId,
        trackId,
        finalPos,
        finalWidth,
        updatedNotes
      );

      sendChangeEvent(SyncOperation.TRANSFORM, Target.PATTERN, {
        patternId: currentPattern.patternId,
        type: currentPattern.type,
        trackId,
        pos: finalPos,
        width: finalWidth,
        ...(currentPattern.type !== "vst" && { notes: updatedNotes })
      });
    }

    setIsGrabbing(false);
    setIsResizeLeft(false);
    setIsResizeRight(false);
  };

  const startAction = (setter: (v: boolean) => void) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setter(true);
  };

  return {
    isGrabbing,
    patternPos,
    patternWidth,
    patternWidthInTacts,
    isResizeLeft,
    isResizeRight,
    handlePatternGlobalMouseMove,
    handlePatternGlobalMouseUp,
    startResizeLeft: startAction(setIsResizeLeft),
    startResizeRight: startAction(setIsResizeRight),
    startGrab: startAction(setIsGrabbing),
    updatePatternPosAndWidth
  };
};

export default usePatternTransform;