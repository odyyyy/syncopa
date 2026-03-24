import { Accessor, Component } from "solid-js";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import { useTracksContext } from "../../../hooks/daw/context/useTracksContext";
import useNoteTransform from "../../../hooks/daw/pianoroll/useNoteTransform";
import { Note as NoteType } from "../../../types/daw.types";
import useNoteManage from "../../../hooks/daw/pianoroll/useNoteManage";

const Note: Component<{
  patternWidthInBeats: Accessor<number>;
  note: NoteType;
}> = (props) => {
  const { tactWidth, beatNumber } = useTracksContext();
  const { transformNote } = useNoteTransform();
  const { currentPatternAndTrackId } = usePianoRollContext();
  const { handleNoteContextMenu, removeNote } = useNoteManage();

  const pxPerBeat = () => (tactWidth() * 3) / beatNumber();

  return (
    <div
      class="bg-primary/88 h-6 border border-base-300/20 cursor-pointer z-20 absolute"
      data-note-id={props.note.noteId}
      oncontextmenu={handleNoteContextMenu}
      style={{
        left: `${Math.max(props.note.pos - 1, 0) * pxPerBeat()}px`,
        width: `${props.note.duration * pxPerBeat()}px`,
      }}
      onMouseDown={(e) => {
        transformNote(e, {
          trackId: currentPatternAndTrackId.trackId,
          patternId: currentPatternAndTrackId.patternId,
          note: props.note,
          patternWidth: props.patternWidthInBeats(),
        });
      }}
      ondblclick={removeNote}
    >
      <div class="absolute top-0 w-1 left-0 h-full cursor-ew-resize  bg-base-content/30 opacity-0 hover:opacity-100 transition-opacity" />

      <div class="absolute top-0 w-1 right-0 h-full cursor-ew-resize bg-base-content/30 opacity-0 hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default Note;
