import { createSignal, createEffect } from "solid-js";
import { useTracksContext } from "../context/useTracksContext";
import { PatternType } from "../../../types/daw.types";
import { useProjectContext } from "../context/useProjectContext";

const usePatternTransform = (pattern: PatternType, trackId: string) => {
  const { tactWidth, tactElementsNumber, beatNumber } = useTracksContext();
  const { setTracks } = useProjectContext();
  const [isGrabbing, setIsGrabbing] = createSignal(false);
  const [patternPos, setPatternPos] = createSignal(0);
  const [patternPosInTacts, setPatternPosInTacts] = createSignal(pattern.pos);

  const [patternWidthInTacts, setPatternWidthInTacts] = createSignal(pattern.width);
  const [isResizeLeft, setIsResizeLeft] = createSignal(false);
  const [isResizeRight, setIsResizeRight] = createSignal(false);
  
  const updatePatternField = <K extends keyof PatternType>(
    trackId: string,
    patternId: string,
    field: K,
    value: PatternType[K]
  ) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.trackId !== trackId) return track;
  
        return {
          ...track,
          patterns: track.patterns?.map((p) =>
            p.patternId === patternId ? { ...p, [field]: value } : p
          ) ?? null,
        };
      })
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
    
    updatePatternField(trackId, pattern.patternId, 'pos', patternPosInTacts());
    updatePatternField(trackId, pattern.patternId, 'width', patternWidthInTacts());

    setIsGrabbing(false);
    setIsResizeLeft(false);
    setIsResizeRight(false);

    if (wasGrabbing || wasResizing) {
      const stepInTacts = 1 / beatNumber() / 4;
      const threshold = stepInTacts * 0.3;

      setPatternPosInTacts((prev) => {
        const snapped = Math.round(prev / stepInTacts) * stepInTacts;
        return Math.abs(prev - snapped) < threshold ? snapped : prev;
      });

      setPatternWidthInTacts((prev) => {
        const snapped = Math.round(prev / stepInTacts) * stepInTacts;
        return snapped;
      });
    }
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
