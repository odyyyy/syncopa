import { Accessor, Component, createSignal } from "solid-js";
import { useTracksContext } from "../../../hooks/daw/context/useTracksContext";
import { Note as NoteType } from "../../../types/daw.types";

const Note: Component<{
  patternWidth: Accessor<number>;
  note: NoteType;
}> = (props) => {
  const { tactWidth, beatNumber } = useTracksContext();
  const [notePos, setNotePos] = createSignal(props.note.pos > 0 ? props.note.pos - 1 : 0);
  const [noteWidth, setNoteWidth] = createSignal(props.note.duration);

  return (
    <div
      class="bg-primary/88 h-6 border border-base-300/20 cursor-pointer z-20 absolute"
      ondblclick={
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      style={{
        left: `${((notePos() * tactWidth()) / beatNumber()) * 3}px`,
        width: `${((noteWidth() * tactWidth()) / beatNumber()) * 3}px`,
      }}
    ></div>
  );
};

export default Note;
