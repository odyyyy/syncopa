import { useProjectContext } from "@/context/daw/project.context";
import { Note } from "../../../types/daw.types";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { audioEngine } from "../../../instruments/audioEngine";
import { PolySynthInstance } from "../../../types/presets.types";
import { createEffect, createSignal } from "solid-js";
import useNoteManage from "./useNoteManage";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";
import { useContextMenu } from "../../../context/daw/contextmenu.context";

const usePianoRoll = () => {
  const { tracks, setTracks } = useProjectContext();
  const { currentPatternAndTrackId, currentPatternWidthInTacts } =
    usePianoRollContext();
  const { beatNumber } = useTimelineContext();

  const { isPianoRollOpen } = usePianoRollContext();
  const [synth, setSynth] = createSignal<PolySynthInstance | undefined>();

  createEffect(() => {
    const { trackId, patternId } = currentPatternAndTrackId;
    const isOpen = isPianoRollOpen();

    if (!trackId || !patternId || !isOpen) return;

    const instrument = audioEngine.getInstrument(trackId);

    if (!instrument) return;

    setSynth(instrument as PolySynthInstance);
  });

  const ROWS_NUMBER = 88;
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const PIANOROLL_NOTES = Array.from({ length: ROWS_NUMBER }, (_, i) => {
    const octave = Math.floor((i + 9) / 12);
    const noteIndex = (i + 9) % 12;

    return `${noteNames[noteIndex]}${octave}`;
  }).reverse();

  const { addNote } = useNoteManage();
  const { sendChangeEvent } = useSendChangeEvent();
  const addNoteInPianoRoll = (e: MouseEvent, pianoPanelWidth: number) => {
    const note = (e.target as HTMLElement).parentElement?.dataset.note;
    if (!note) return;

    let noteBeatPos = Math.ceil(
      (e.clientX - pianoPanelWidth) / (e.target as HTMLElement).offsetWidth,
    );

    const patternBeatsWidth = currentPatternWidthInTacts() * beatNumber();

    noteBeatPos =
      noteBeatPos <= currentPatternWidthInTacts() * beatNumber()
        ? noteBeatPos
        : Math.ceil(patternBeatsWidth);

    const newNote: Note = {
      noteId: crypto.randomUUID(),
      pos: noteBeatPos,
      note,
      duration:
        noteBeatPos === Math.ceil(patternBeatsWidth) &&
        patternBeatsWidth % 1 > 0
          ? patternBeatsWidth % 1
          : 1,
      velocity: 1,
    };

    addNote(
      newNote,
      currentPatternAndTrackId.trackId,
      currentPatternAndTrackId.patternId,
    );
    sendChangeEvent(SyncOperation.CREATE, Target.NOTE, {
      trackId: currentPatternAndTrackId.trackId,
      patternId: currentPatternAndTrackId.patternId,
      note: newNote,
    });

    (synth() as PolySynthInstance)?.triggerAttackRelease(newNote.note, 1);
  };

  const { removeNote } = useNoteManage();
  const removeNoteFromPianoRoll = (e: MouseEvent) => {
    const noteId = (e.currentTarget as HTMLElement).dataset?.noteId;
    if (!noteId) return;

    removeNote(
      currentPatternAndTrackId.trackId,
      currentPatternAndTrackId.patternId,
      noteId,
    );
    sendChangeEvent(SyncOperation.REMOVE, Target.NOTE, {
      trackId: currentPatternAndTrackId.trackId,
      patternId: currentPatternAndTrackId.patternId,
      noteId,
    });
  };

  const findPatternById = () => {
    const patternId = currentPatternAndTrackId.patternId;
    const trackId = currentPatternAndTrackId.trackId;
    if (!patternId || !trackId) return;
    for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
      const track = tracks[trackIndex];
      if (!track?.patterns) continue;

      const patternIndex = track.patterns.findIndex(
        (p) => p.patternId === patternId && p.type != "audio",
      );
      if (patternIndex !== -1) {
        return track.patterns[patternIndex];
      }
    }
    return null;
  };

  const onPianoKeyPress = (e: MouseEvent) => {
    const key = (e.target as HTMLElement).closest(
      "[data-note]",
    ) as HTMLElement | null;

    if (!key) return;

    const note = key.dataset.note;

    (synth() as PolySynthInstance)?.triggerAttackRelease(note!, 1);
  };

  const { pianoRollHeight, setPianoRollHeight } = usePianoRollContext();
  const resizePianoRollPanel = (e: MouseEvent) => {
    const [MIN_HEIGHT, MAX_HEIGHT] = [150, 500];

    const startY = e.clientY;
    const startHeight = pianoRollHeight();

    const move = (e: MouseEvent) => {
      const newHeight = startHeight - (e.clientY - startY);
      setPianoRollHeight(Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight)));
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const { openMenu } = useContextMenu();
  const handleNoteContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openMenu(e.clientX, e.clientY, [
      {
        label: "Удалить ноту",
        icon: "✕",
        onClick: () => removeNoteFromPianoRoll(e),
      },
    ]);
  };

  return {
    addNoteInPianoRoll,
    PIANOROLL_NOTES,
    ROWS_NUMBER,
    onPianoKeyPress,
    findPatternById,
    noteNames,
    resizePianoRollPanel,
    removeNoteFromPianoRoll,
    handleNoteContextMenu,
  };
};

export default usePianoRoll;
