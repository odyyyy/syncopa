import { useContextMenu } from "../../../context/daw/contextmenu.context";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import {  PatternType, PatternVST } from "../../../types/daw.types";
import { useProjectContext } from "../context/useProjectContext";

const useNoteManage = () => {
  const { currentPatternAndTrackId } = usePianoRollContext();
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


  
  const removeNote = (e: MouseEvent) => {
    const noteId = (e.currentTarget as HTMLElement).dataset?.noteId
    if (!noteId) return;
    
    const indexes = findIndexes(currentPatternAndTrackId.trackId, currentPatternAndTrackId.patternId, noteId);
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
        notes: prevPattern.notes?.filter((note) => note.noteId != noteId)
      };
    });
    
  }
  
  
  
  const { openMenu } = useContextMenu();
  const handleNoteContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openMenu(e.clientX, e.clientY, [
      {
        label: "Удалить ноту",
        icon: "✕",
        onClick: () => removeNote(e),
      },
      
    ]);
  };
  
  return {
    handleNoteContextMenu,findIndexes,removeNote
  }
}
export default useNoteManage;