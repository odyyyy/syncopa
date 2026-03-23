import * as Tone from "tone";
import { useProjectContext } from "../context/useProjectContext";
import { Note } from "../../../types/daw.types";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import { useTracksContext } from "../context/useTracksContext";

const usePianoRoll = () => {
  const { tracks, setTracks } = useProjectContext();
  const { currentPatternAndTrackId, currentPatternWidthInTacts } =
    usePianoRollContext();
  const { beatNumber } = useTracksContext();
  
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  

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

  const addNote = (e: MouseEvent, pianoPanelWidth: number) => {
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

    setTracks(
      (track) => track.trackId === currentPatternAndTrackId.trackId,
      "patterns",
      (patterns) =>
        patterns?.map((pattern) => {
          if (
            pattern.patternId === currentPatternAndTrackId.patternId &&
            pattern.type === "vst"
          ) {
            return {
              ...pattern,
              notes: [...(pattern.notes || []), newNote],
            };
          }
          return pattern;
        }) ?? null,
    );
    
    // TODO: Use Exact Track Patterns Instrument
    synth.triggerAttackRelease(note, "8n");
    
    
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

    synth.triggerAttackRelease(note!, "8n");
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

  return {
    addNote,
    PIANOROLL_NOTES,
    ROWS_NUMBER,
    onPianoKeyPress,
    findPatternById,
    noteNames,
    resizePianoRollPanel,
  };
};

export default usePianoRoll;
