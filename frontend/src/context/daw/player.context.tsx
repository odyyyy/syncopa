import { createContext, ParentComponent, createSignal, createEffect } from "solid-js";
import { PlayerContextType } from "../../types/daw.types";
import * as Tone from "tone";
import { useTracksContext } from "../../hooks/daw/context/useTracksContext";
import { useProjectContext } from "../../hooks/daw/context/useProjectContext";
import { MIN_MASTER_VOLUME_DB } from "../../config/config";

export const PlayerContext = createContext<PlayerContextType>();

export const PlayerProvider: ParentComponent = (props) => {
  const [time, setTime] = createSignal<string>("00:00.0");
  const [bpm, setBpm] = createSignal<number>(120);
  const [playerBeatPos, setPlayerBeatPos] = createSignal<number>(0);
  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);
  const [tactElementsNumber, setTactElementsNumber] = createSignal(30);

  const { project } = useProjectContext();
  const [totalVolume, setTotalVolume] = createSignal(
    project()?.payload?.metadata?.totalVolume ?? 50,
  );
  createEffect(() => {
    Tone.getDestination().volume.value =
      (totalVolume() * -MIN_MASTER_VOLUME_DB) / 100 + MIN_MASTER_VOLUME_DB;
  })

  const [intervalId, setIntervalId] = createSignal<number | undefined>(
    undefined,
  );
  const { tracks } = useProjectContext();
  const { beatNumber } = useTracksContext();

  const [parts, setParts] = createSignal<Tone.Part[]>([]);
  const startOrPausePlaying = async () => {
    setIsPlaying(!isPlaying());

    if (!isPlaying()) {
      Tone.getTransport().stop();
      clearInterval(intervalId());

      parts().forEach((part) => part.dispose());
      setParts([]);
    } else {
      parts().forEach((part) => part.dispose());

      const synth = new Tone.FMSynth().toDestination();
      const newParts: Tone.Part[] = [];

      const patternsToPlay = tracks.flatMap(track => 
        track.patterns?.filter((pattern) => {
          return (
            (pattern.pos + 1) * pattern.width * beatNumber() >= playerBeatPos()
          );
        }) ?? []
      );
      
      if (!patternsToPlay || patternsToPlay.length === 0) return;

      patternsToPlay.forEach((pattern) => {
        if (pattern.type === "vst") {
          const notesArray =
            pattern.notes
              ?.filter((note) => note.pos / beatNumber() > playerBeatPos())
              .map((note) => ({
                time: Math.max(
                  0,
                  ((note.pos - 1) * 60) / bpm() -
                    ((playerBeatPos() * 60) / bpm()) * beatNumber(),
                ),
                note: note.note,
                duration: (note.duration * 60) / bpm(),
                velocity: note.velocity,
              })) ?? [];

          if (notesArray.length > 0) {
            const part = new Tone.Part((time, value) => {
              synth.triggerAttackRelease(
                value.note,
                value.duration,
                time,
                value.velocity,
              );
            }, notesArray).start(0);

            newParts.push(part);
          }
        }
      });

      setParts(newParts);

      Tone.getTransport().start();
      const interval = setInterval(() => {
        setPlayerBeatPos(playerBeatPos() + 60 / bpm() / 100);
      }, 10);
      setIntervalId(interval);
    }
  };
  return (
    <PlayerContext.Provider
      value={{
        time,
        setTime,
        bpm,
        setBpm,
        playerBeatPos,
        setPlayerBeatPos,
        isPlaying,
        setIsPlaying,
        startOrPausePlaying,
        tactElementsNumber,
        setTactElementsNumber,
        totalVolume,
        setTotalVolume,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};
