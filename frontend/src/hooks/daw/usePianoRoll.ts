import * as Tone from "tone";
import { useProjectContext } from "./context/useProjectContext";
import { Note } from "../../types/daw.types";
import { usePianoRollContext } from "../../context/daw/pianoroll.context";

const usePianoRoll = () => {
  const { tracks, setTracks } = useProjectContext();
  const { currentPatternAndTrackId } = usePianoRollContext();

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
  
  const notes = Array.from({ length: ROWS_NUMBER }, (_, i) => {
    const octave = Math.floor((i + 9) / 12);
    const noteIndex = (i + 9) % 12;

    return `${noteNames[noteIndex]}${octave}`;
  }).reverse();

  const addNote = (e: MouseEvent, pianoPanelWidth: number) => {
    const note = (e.target as HTMLElement).parentElement?.dataset.note;
    if (!note) return;

    const noteBeatPos = Math.ceil(
      (e.clientX - pianoPanelWidth) / (e.target as HTMLElement).offsetWidth,
    );
    

    const newNote: Note = {
      pos: noteBeatPos,
      note,
      duration: 1,
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
  };

  const findPatternById = () =>  {
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

  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  let isToneStarted = false;
  const onPianoKeyPress = async (e: MouseEvent) => {
    const key = (e.target as HTMLElement).closest(
      "[data-note]",
    ) as HTMLElement | null;

    if (!key) return;

    const note = key.dataset.note;

    if (!isToneStarted) {
      await Tone.start();
      isToneStarted = true;
    }

    synth.triggerAttackRelease(note!, "8n");
  };

  return { addNote, notes, ROWS_NUMBER, onPianoKeyPress, findPatternById,noteNames };
};

export default usePianoRoll;
