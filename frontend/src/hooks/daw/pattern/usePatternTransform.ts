import { createSignal, createEffect, Accessor } from "solid-js";
import { useTracksContext } from "../context/useTracksContext";
import { Note, PatternType, PatternVST } from "../../../types/daw.types";
import { useProjectContext } from "../context/useProjectContext";

const usePatternTransform = (
  pattern: Accessor<PatternType>,
  trackId: string,
) => {
  const { tactWidth, tactElementsNumber, beatNumber } = useTracksContext();
  const { setTracks } = useProjectContext();
  const [isGrabbing, setIsGrabbing] = createSignal(false);
  const [patternPos, setPatternPos] = createSignal(0);
  const [patternPosInTacts, setPatternPosInTacts] = createSignal(pattern().pos);

  const [patternWidthInTacts, setPatternWidthInTacts] = createSignal(
    pattern().width,
  );
  const [isResizeLeft, setIsResizeLeft] = createSignal(false);
  const [isResizeRight, setIsResizeRight] = createSignal(false);

  const updatePatternField = <K extends keyof PatternType>(
    trackId: string,
    patternId: string,
    field: K,
    value: PatternType[K],
  ) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.trackId !== trackId) return track;

        return {
          ...track,
          patterns:
            track.patterns?.map((p) =>
              p.patternId === patternId ? { ...p, [field]: value } : p,
            ) ?? null,
        };
      }),
    );
  };

  createEffect(() => {
    setPatternPos(patternPosInTacts() * tactWidth());
  });

  const patternWidth = () => patternWidthInTacts() * tactWidth();

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isGrabbing()) {
      e.preventDefault();
      e.stopPropagation();

      setPatternPosInTacts((prev) => {
        const newPosInTacts = prev + e.movementX / tactWidth();
        if (newPosInTacts < 0) return 0;
        const maxPos = tactElementsNumber() - patternWidthInTacts();
        if (newPosInTacts > maxPos) return maxPos;
        return newPosInTacts;
      });
    }

    if (isResizeRight()) {
      e.preventDefault();
      e.stopPropagation();

      setPatternWidthInTacts((prev) => {
        const deltaTacts = e.movementX / tactWidth();
        const newWidth = prev + deltaTacts;
        const minWidth = 1 / beatNumber();
        const maxWidth = tactElementsNumber() - patternPosInTacts();
        return Math.min(maxWidth, Math.max(minWidth, newWidth));
      });
    }

    if (isResizeLeft()) {
      e.preventDefault();
      e.stopPropagation();

      if (patternPosInTacts() - e.movementX / tactWidth() < 0) return;

      setPatternWidthInTacts((prev) => {
        const deltaTacts = -e.movementX / tactWidth();
        const newWidth = prev + deltaTacts;
        const minWidth = 1 / beatNumber();
        return Math.max(minWidth, newWidth);
      });

      setPatternPosInTacts((posPrev) => posPrev + e.movementX / tactWidth());
    }
  };

  const handleGlobalMouseUp = () => {
    const wasGrabbing = isGrabbing();
    const wasResizing = isResizeLeft() || isResizeRight();

    if (wasGrabbing || wasResizing) {
      const stepInTacts = 1 / beatNumber() / 4;
      const finalPos =
        Math.round(patternPosInTacts() / stepInTacts) * stepInTacts;
      const finalWidth =
        Math.round(patternWidthInTacts() / stepInTacts) * stepInTacts;

      const maxPos = finalWidth * beatNumber();
      let updatedNotes: Note[] = [];

      if ("notes" in pattern()) {
        updatedNotes = (pattern() as PatternVST).notes;
      }

      if (pattern().type === "vst" && pattern().width > finalWidth) {
        const newNotes: Note[] = [];

        for (const note of (pattern() as PatternVST).notes) {
          const startPos = note.pos - 1;
          const endPos = startPos + note.duration;

          if (endPos > maxPos) {
            if (startPos >= maxPos) continue;

            newNotes.push({
              ...note,
              duration: Math.max(0.1, maxPos - startPos),
            });
          } else {
            newNotes.push(note);
          }
        }
        updatedNotes = newNotes;
      }

      setTracks((prev) =>
        prev.map((track) => {
          if (track.trackId !== trackId) return track;
          return {
            ...track,
            patterns:
              track.patterns?.map((p) =>
                p.patternId === pattern().patternId
                  ? {
                      ...p,
                      pos: finalPos,
                      width: finalWidth,
                      notes: updatedNotes,
                    }
                  : p,
              ) ?? null,
          };
        }),
      );

      setPatternPosInTacts(finalPos);
      setPatternWidthInTacts(finalWidth);
    }

    setIsGrabbing(false);
    setIsResizeLeft(false);
    setIsResizeRight(false);
  };

  const startResizeLeft = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizeLeft(true);
  };

  const startResizeRight = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizeRight(true);
  };

  const startGrab = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGrabbing(true);
  };

  return {
    isGrabbing,
    patternPos,
    patternWidth,
    patternWidthInTacts,
    isResizeLeft,
    isResizeRight,
    handleGlobalMouseMove,
    handleGlobalMouseUp,
    startResizeLeft,
    startResizeRight,
    startGrab,
    setPatternPos,
  };
};

export default usePatternTransform;
