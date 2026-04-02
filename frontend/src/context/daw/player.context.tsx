import {
  createContext,
  ParentComponent,
  createSignal,
  createEffect,
} from "solid-js";
import { PlayerContextType } from "../../types/daw.types";
import * as Tone from "tone";
import { useTracksContext } from "../../hooks/daw/context/useTracksContext";
import { useProjectContext } from "../../hooks/daw/context/useProjectContext";
import { MIN_MASTER_VOLUME_DB } from "../../config/config";
import { audioEngine } from "../../instruments/audioEngine";
import { PolySynthInstance } from "../../types/presets.types";

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
  });

  const { tracks } = useProjectContext();
  const { beatNumber } = useTracksContext();

  const [parts, setParts] = createSignal<Tone.Part[]>([]);

  let isInitialized = false;

  const startOrPausePlaying = async () => {
    if (!isInitialized) {
      await Tone.start();
      isInitialized = true;
    }
    const transport = Tone.getTransport();

    if (isPlaying()) {
      transport.stop();
      transport.cancel();
      setIsPlaying(false);
      parts().forEach((p) => p.dispose());
      setParts([]);
      return;
    }

    setIsPlaying(true);

    parts().forEach((p) => p.dispose());

    const currentBpm = bpm();
    const currentBeatNumber = beatNumber();
    const startPosInBars = playerBeatPos();

    const newParts: Tone.Part[] = [];

    tracks.forEach((track) => {
      track.patterns?.forEach((pattern) => {
        if (pattern.type !== "vst" || !pattern.notes) return;

        const patternStartBar = pattern.pos;
        const patternEndBar = pattern.pos + pattern.width;

        if (patternEndBar < startPosInBars) return;

        const events = pattern.notes
          .map((n) => {
            const absoluteNoteBar =
              patternStartBar + (n.pos - 1) / currentBeatNumber;

            return {
              barPos: absoluteNoteBar,
              note: n.note,
              duration: n.duration * (60 / currentBpm),
              velocity: n.velocity,
            };
          })
          .filter((e) => e.barPos >= startPosInBars);

        const synth = audioEngine.getInstrument(track.trackId);

        if (events.length > 0) {
          const part = new Tone.Part(
            (time, val) => {
              (synth as PolySynthInstance).triggerAttackRelease(
                val.note,
                val.duration,
                time,
                val.velocity,
              );
            },
            events.map((e) => ({
              time:
                (e.barPos - startPosInBars) *
                currentBeatNumber *
                (60 / currentBpm),
              ...e,
            })),
          ).start(0);

          newParts.push(part);
        }
      });
    });

    setParts(newParts);
    transport.seconds = 0;
    transport.start();

    const updateUI = () => {
      if (transport.state === "started") {
        const secondsElapsed = transport.seconds;

        const totalBeatsElapsed = (secondsElapsed * currentBpm) / 60;
        const barsElapsed = totalBeatsElapsed / currentBeatNumber;

        setPlayerBeatPos(startPosInBars + barsElapsed);

        requestAnimationFrame(updateUI);
      }
    };
    requestAnimationFrame(updateUI);
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
